import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CropCycle, ScoutingLog } from '../../types/index.ts';
import {
  Sprout,
  Plus,
  Search,
  Calendar,
  AlertTriangle,
  Bug,
  DollarSign,
  TrendingUp,
  X,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const CropsModule: React.FC = () => {
  const { crops, activeFarm, addCropCycle, updateCropCycle, addScoutingLog, formatMoney } = useApp();
  const farmCrops = crops.filter((c) => c.farmId === activeFarm.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddCycleOpen, setIsAddCycleOpen] = useState(false);
  const [selectedCropForScout, setSelectedCropForScout] = useState<CropCycle | null>(null);
  const [selectedCropForHarvest, setSelectedCropForHarvest] = useState<CropCycle | null>(null);

  // New Crop Cycle form state
  const [blockId, setBlockId] = useState(activeFarm.blocks[0]?.id || '');
  const [cropName, setCropName] = useState('Commercial Hybrid Maize');
  const [variety, setVariety] = useState('Kenya Seed H614D');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('');
  const [status, setStatus] = useState<CropCycle['status']>('Vegetative Growth');
  const [acresPlanted, setAcresPlanted] = useState<number>(activeFarm.blocks[0]?.acres || 40);
  const [seedUsedKg, setSeedUsedKg] = useState<number>(400);
  const [fertilizerUsedKg, setFertilizerUsedKg] = useState<number>(2000);
  const [targetYieldKg, setTargetYieldKg] = useState<number>(144000);
  const [totalCostKes, setTotalCostKes] = useState<number>(1650000);

  // New Scouting form state
  const [scoutedBy, setScoutedBy] = useState('Agronomist Peter Waweru');
  const [pestSeverity, setPestSeverity] = useState<ScoutingLog['pestSeverity']>('Low');
  const [findings, setFindings] = useState('');
  const [recommendedAction, setRecommendedAction] = useState('');

  // Harvest record form state
  const [actualYieldKg, setActualYieldKg] = useState<number>(0);

  const filteredCrops = farmCrops.filter((crop) => {
    const matchesSearch =
      crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.blockName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || crop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCycle = (e: React.FormEvent) => {
    e.preventDefault();
    const blk = activeFarm.blocks.find((b) => b.id === blockId) || activeFarm.blocks[0];

    addCropCycle({
      farmId: activeFarm.id,
      blockId: blk?.id || 'blk-custom',
      blockName: blk?.name || 'Allocated Block',
      cropName,
      variety,
      plantingDate,
      expectedHarvestDate: expectedHarvestDate || '2026-11-30',
      status,
      acresPlanted: Number(acresPlanted),
      seedUsedKg: Number(seedUsedKg),
      fertilizerUsedKg: Number(fertilizerUsedKg),
      targetYieldKg: Number(targetYieldKg),
      totalCostKes: Number(totalCostKes),
    });

    setIsAddCycleOpen(false);
  };

  const handleSaveScout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCropForScout || !findings) return;

    addScoutingLog(selectedCropForScout.id, {
      date: new Date().toISOString().split('T')[0],
      scoutedBy,
      pestSeverity,
      findings,
      recommendedAction: recommendedAction || 'Continue routine pest threshold monitoring.',
    });

    setSelectedCropForScout(null);
    setFindings('');
    setRecommendedAction('');
  };

  const handleSaveHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCropForHarvest || actualYieldKg <= 0) return;

    updateCropCycle({
      ...selectedCropForHarvest,
      actualYieldKg: Number(actualYieldKg),
      status: 'Harvesting',
    });

    setSelectedCropForHarvest(null);
    setActualYieldKg(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Crop Production & Agronomy Management</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Planting schedules, certified seed records, pest scouting thresholds, and harvest yield per acre for {activeFarm.name}.
          </p>
        </div>
        <button
          onClick={() => setIsAddCycleOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Crop Cycle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop, variety, or block..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-neutral-100 rounded-lg text-xs">
          {['all', 'Vegetative Growth', 'Flowering & Fruiting', 'Harvesting', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                statusFilter === st ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {st === 'all' ? 'All Stages' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Crops Cards List */}
      <div className="space-y-4">
        {filteredCrops.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-neutral-200 text-center text-xs text-neutral-500">
            No crop cycles found matching your criteria.
          </div>
        ) : (
          filteredCrops.map((crop) => {
            const targetBags = Math.round(crop.targetYieldKg / 90);
            const actualBags = crop.actualYieldKg ? Math.round(crop.actualYieldKg / 90) : 0;
            const yieldPerAcreKg = Math.round(crop.targetYieldKg / (crop.acresPlanted || 1));
            const costPerKgKes = (crop.totalCostKes / (crop.targetYieldKg || 1)).toFixed(2);

            return (
              <div
                key={crop.id}
                className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs hover:border-neutral-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-neutral-900">{crop.cropName}</span>
                      <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {crop.variety}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      Block: <strong>{crop.blockName}</strong> · Planted: <span className="font-mono">{crop.plantingDate}</span> · Expected Harvest: <span className="font-mono">{crop.expectedHarvestDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-neutral-100 text-neutral-700">
                      {crop.status}
                    </span>
                    <button
                      onClick={() => setSelectedCropForScout(crop)}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Bug className="w-3.5 h-3.5" />
                      <span>Log Scouting</span>
                    </button>
                    <button
                      onClick={() => setSelectedCropForHarvest(crop)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors"
                    >
                      Record Harvest
                    </button>
                  </div>
                </div>

                {/* Key Production Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs bg-neutral-50 p-3.5 rounded-xl">
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase block">Acreage</span>
                    <span className="font-bold font-mono text-neutral-900 tabular-nums">{crop.acresPlanted} Acres</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase block">Fertilizer Used</span>
                    <span className="font-bold font-mono text-neutral-900 tabular-nums">{crop.fertilizerUsedKg.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase block">Target Yield</span>
                    <span className="font-bold font-mono text-neutral-900 tabular-nums">
                      {crop.targetYieldKg.toLocaleString()} kg (~{targetBags} bags)
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase block">Yield / Acre</span>
                    <span className="font-bold font-mono text-neutral-900 tabular-nums">{yieldPerAcreKg.toLocaleString()} kg/ac</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] uppercase block">Cost / kg</span>
                    <span className="font-bold font-mono text-emerald-800 tabular-nums">KES {costPerKgKes}</span>
                  </div>
                </div>

                {/* Actual Harvest if recorded */}
                {crop.actualYieldKg !== undefined && crop.actualYieldKg > 0 && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-950">
                    <div>
                      <strong>Actual Harvest Logged:</strong>{' '}
                      <span className="font-mono font-bold">{crop.actualYieldKg.toLocaleString()} kg</span> (~{actualBags} bags of 90kg)
                    </div>
                    <div className="font-mono text-emerald-800 font-semibold">
                      Yield Variance: {crop.actualYieldKg >= crop.targetYieldKg ? '+' : ''}
                      {(
                        ((crop.actualYieldKg - crop.targetYieldKg) / crop.targetYieldKg) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                )}

                {/* Scouting Logs History */}
                {crop.scoutingLogs.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                      Field Scouting & IPM Reports ({crop.scoutingLogs.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {crop.scoutingLogs.map((log) => (
                        <div key={log.id} className="p-2.5 rounded-lg border border-neutral-200 bg-white space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-neutral-500">{log.date} · {log.scoutedBy}</span>
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                log.pestSeverity === 'High' || log.pestSeverity === 'Severe'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {log.pestSeverity} Pressure
                            </span>
                          </div>
                          <p className="text-neutral-800 font-medium text-[11px]">{log.findings}</p>
                          <div className="text-[10px] text-emerald-800">
                            <strong>Action:</strong> {log.recommendedAction}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: New Crop Cycle */}
      {isAddCycleOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Initiate Crop Planting Cycle</h3>
              <button onClick={() => setIsAddCycleOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCycle} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Target Field Block *</label>
                <select
                  value={blockId}
                  onChange={(e) => setBlockId(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                >
                  {activeFarm.blocks.map((blk) => (
                    <option key={blk.id} value={blk.id}>
                      {blk.name} ({blk.acres} Acres - {blk.irrigationStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Crop Type *</label>
                  <input
                    required
                    type="text"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. Commercial Hybrid Maize"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Seed Variety *</label>
                  <input
                    required
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g. Kenya Seed H614D"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Planting Date *</label>
                  <input
                    required
                    type="date"
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Expected Harvest Date</label>
                  <input
                    type="date"
                    value={expectedHarvestDate}
                    onChange={(e) => setExpectedHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Planted Acres *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={acresPlanted}
                    onChange={(e) => setAcresPlanted(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Seed Used (kg)</label>
                  <input
                    type="number"
                    value={seedUsedKg}
                    onChange={(e) => setSeedUsedKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Fertilizer (kg)</label>
                  <input
                    type="number"
                    value={fertilizerUsedKg}
                    onChange={(e) => setFertilizerUsedKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Target Yield (kg)</label>
                  <input
                    type="number"
                    value={targetYieldKg}
                    onChange={(e) => setTargetYieldKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Total Budget / Cost (KES)</label>
                  <input
                    type="number"
                    value={totalCostKes}
                    onChange={(e) => setTotalCostKes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddCycleOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Log Planting Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Scouting Report */}
      {selectedCropForScout && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">
                Scouting Log: {selectedCropForScout.cropName}
              </h3>
              <button onClick={() => setSelectedCropForScout(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScout} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Inspector / Agronomist Name</label>
                <input
                  required
                  type="text"
                  value={scoutedBy}
                  onChange={(e) => setScoutedBy(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Observed Pest / Disease Severity</label>
                <select
                  value={pestSeverity}
                  onChange={(e) => setPestSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                >
                  <option value="Low">Low (Under Economic Threshold)</option>
                  <option value="Medium">Medium (Approaching Spray Threshold)</option>
                  <option value="High">High (Immediate Intervention Required)</option>
                  <option value="Severe">Severe (Outbreak Level)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Field Observations & Symptoms *</label>
                <textarea
                  required
                  rows={3}
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  placeholder="e.g. Observed 6% Fall Armyworm leaf feeding damage; pinholes on 3-week whorl..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Prescribed Action / Chemical Spray</label>
                <input
                  type="text"
                  value={recommendedAction}
                  onChange={(e) => setRecommendedAction(e.target.value)}
                  placeholder="e.g. Apply Emamectin Benzoate (Prove) @ 50g/ha early morning"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setSelectedCropForScout(null)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Scouting Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Harvest */}
      {selectedCropForHarvest && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Record Harvest Weight</h3>
              <button onClick={() => setSelectedCropForHarvest(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHarvest} className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="font-semibold text-neutral-900">{selectedCropForHarvest.cropName} ({selectedCropForHarvest.variety})</div>
                <div className="text-[11px] text-neutral-500">
                  Target: {selectedCropForHarvest.targetYieldKg.toLocaleString()} kg (~{Math.round(selectedCropForHarvest.targetYieldKg / 90)} bags)
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Actual Net Harvest Weight (kg) *</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={actualYieldKg}
                  onChange={(e) => setActualYieldKg(Number(e.target.value))}
                  placeholder="e.g. 441600"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Equivalent to ~{actualYieldKg ? Math.round(actualYieldKg / 90) : 0} bags of 90kg
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setSelectedCropForHarvest(null)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm & Save Harvest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
