import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { WaterSource } from '../../types/index.ts';
import {
  Droplets,
  Plus,
  Activity,
  Gauge,
  Sun,
  X,
  Play,
  Square,
  AlertTriangle,
} from 'lucide-react';

export const IrrigationModule: React.FC = () => {
  const { activeFarm, waterSources, addWaterSource, updateWaterSource, showNotification } = useApp();
  const farmWater = waterSources.filter((w) => w.farmId === activeFarm.id);

  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);

  // New Water Source state
  const [name, setName] = useState('');
  const [type, setType] = useState<WaterSource['type']>('Solar Borehole');
  const [dailyCapacityM3, setDailyCapacityM3] = useState<number>(350);
  const [currentLevelPct, setCurrentLevelPct] = useState<number>(85);
  const [flowRateLps, setFlowRateLps] = useState<number>(8.5);
  const [waterQualityPh, setWaterQualityPh] = useState<number>(7.1);

  const togglePump = (source: WaterSource) => {
    const nextStatus = source.pumpStatus === 'Active' ? 'Standby' : 'Active';
    updateWaterSource({
      ...source,
      pumpStatus: nextStatus,
    });
    showNotification(`Pump station ${source.name} set to ${nextStatus}.`);
  };

  const handleCreateSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addWaterSource({
      farmId: activeFarm.id,
      name,
      type,
      currentLevelPct: Number(currentLevelPct),
      dailyCapacityM3: Number(dailyCapacityM3),
      currentExtractionM3: Math.round(Number(dailyCapacityM3) * 0.6),
      pumpStatus: 'Active',
      flowRateLps: Number(flowRateLps),
      waterQualityPh: Number(waterQualityPh),
    });

    setIsAddSourceOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Irrigation, Water Sources & Soil Moisture Telemetry</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Solar borehole extraction meters, dam storage reserves, center pivot scheduling, and root-zone soil moisture on {activeFarm.name}.
          </p>
        </div>
        <button
          onClick={() => setIsAddSourceOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Water Node</span>
        </button>
      </div>

      {/* Water Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {farmWater.map((source) => (
          <div key={source.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-bold text-sm text-neutral-900">{source.name}</h3>
                <span className="text-[11px] font-mono text-emerald-800 font-semibold">{source.type}</span>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  source.pumpStatus === 'Active'
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {source.pumpStatus}
              </span>
            </div>

            {/* Level Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Storage Reservoir Level</span>
                <span className="font-bold font-mono text-neutral-900 tabular-nums">{source.currentLevelPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all"
                  style={{ width: `${source.currentLevelPct}%` }}
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-50 p-3 rounded-xl">
              <div>
                <span className="text-neutral-500 text-[10px] uppercase block">Flow Rate</span>
                <span className="font-bold font-mono text-neutral-900 tabular-nums">{source.flowRateLps} L/sec</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px] uppercase block">Water pH</span>
                <span className="font-bold font-mono text-neutral-900 tabular-nums">{source.waterQualityPh.toFixed(1)} pH</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px] uppercase block">Daily Capacity</span>
                <span className="font-bold font-mono text-neutral-900 tabular-nums">{source.dailyCapacityM3.toLocaleString()} m³</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px] uppercase block">Extraction Today</span>
                <span className="font-bold font-mono text-emerald-800 tabular-nums">{source.currentExtractionM3} m³</span>
              </div>
            </div>

            {/* Toggle Action */}
            <button
              onClick={() => togglePump(source)}
              className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                source.pumpStatus === 'Active'
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white'
              }`}
            >
              {source.pumpStatus === 'Active' ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Switch to Standby</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Activate Pump Station</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Field Soil Moisture Sensor Telemetry Grid */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div>
            <h3 className="font-bold text-base text-neutral-900">Real-time Soil Moisture IoT Sensor Nodes</h3>
            <p className="text-xs text-neutral-500">
              Continuous Volumetric Water Content (% VWC) measured at 20cm and 40cm crop root depths.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded font-semibold">
            Telemetry Refresh: 5 mins
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeFarm.blocks.map((blk) => {
            const isDry = blk.soilMoisturePct < 35;
            return (
              <div key={blk.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="font-bold text-neutral-900 text-xs">{blk.name}</div>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      isDry ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {isDry ? 'Irrigation Needed' : 'Adequate'}
                  </span>
                </div>

                <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                  {blk.soilMoisturePct}% VWC
                </div>

                <div className="text-[11px] text-neutral-500">
                  Crop: <strong>{blk.currentCrop || 'Fallow'}</strong>
                </div>

                <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-200/60 flex justify-between">
                  <span>Method: {blk.irrigationStatus}</span>
                  <span>Target: 45-65%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add Water Node */}
      {isAddSourceOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Add Water Node</h3>
              <button onClick={() => setIsAddSourceOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Water Node Name *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. South Aquifer Solar Borehole #2"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                >
                  <option value="Solar Borehole">Solar Borehole</option>
                  <option value="Earth Dam">Earth Dam</option>
                  <option value="River Pump Station">River Pump Station</option>
                  <option value="Rainwater Reservoir">Rainwater Reservoir</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Daily Capacity (m³) *</label>
                  <input
                    required
                    type="number"
                    value={dailyCapacityM3}
                    onChange={(e) => setDailyCapacityM3(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Current Level (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentLevelPct}
                    onChange={(e) => setCurrentLevelPct(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Flow Rate (L/s)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={flowRateLps}
                    onChange={(e) => setFlowRateLps(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Water Quality pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={waterQualityPh}
                    onChange={(e) => setWaterQualityPh(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddSourceOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Water Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
