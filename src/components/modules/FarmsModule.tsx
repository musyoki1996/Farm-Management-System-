import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Farm, FarmBlock } from '../../types/index.ts';
import {
  Building2,
  Plus,
  MapPin,
  Compass,
  Layers,
  Droplets,
  Phone,
  User,
  CheckCircle,
  X,
  FileText,
} from 'lucide-react';

export const FarmsModule: React.FC = () => {
  const { farms, activeFarm, selectedFarmId, setSelectedFarmId, addFarm, addBlockToFarm } = useApp();
  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);

  // New Farm form state
  const [newFarmName, setNewFarmName] = useState('');
  const [newFarmCode, setNewFarmCode] = useState('');
  const [newCounty, setNewCounty] = useState('Nakuru');
  const [newSubCounty, setNewSubCounty] = useState('');
  const [newGps, setNewGps] = useState('');
  const [newAcres, setNewAcres] = useState<number>(100);
  const [newFarmType, setNewFarmType] = useState<Farm['farmType']>('Commercial Mixed');
  const [newOwnership, setNewOwnership] = useState<Farm['ownershipType']>('Freehold Title');
  const [newSoilType, setNewSoilType] = useState<Farm['soilType']>('Volcanic Loam');
  const [newWaterSource, setNewWaterSource] = useState<Farm['primaryWaterSource']>('Solar Borehole');
  const [newManagerName, setNewManagerName] = useState('');
  const [newManagerPhone, setNewManagerPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // New Block form state
  const [blockName, setBlockName] = useState('');
  const [blockAcres, setBlockAcres] = useState<number>(25);
  const [blockCrop, setBlockCrop] = useState('');
  const [blockPh, setBlockPh] = useState<number>(6.2);
  const [blockIrrigation, setBlockIrrigation] = useState<FarmBlock['irrigationStatus']>('Drip');

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmName || !newCounty) return;

    addFarm({
      name: newFarmName,
      code: newFarmCode || `AGR-${newCounty.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      county: newCounty,
      subCounty: newSubCounty || 'Central Sub-County',
      gpsCoordinates: newGps || '0.2827° S, 36.0000° E',
      totalAcres: Number(newAcres),
      totalHectares: +(Number(newAcres) * 0.404686).toFixed(1),
      ownershipType: newOwnership,
      farmType: newFarmType,
      soilType: newSoilType,
      primaryWaterSource: newWaterSource,
      managerName: newManagerName || 'Lead Farm Manager',
      managerPhone: newManagerPhone || '+254 700 000 000',
      notes: newNotes,
      blocks: [
        {
          id: `blk-${Date.now()}-1`,
          name: 'Block 1 (Primary Field)',
          acres: Math.min(Number(newAcres), 50),
          currentCrop: 'Seasonal Crop',
          soilPh: 6.2,
          irrigationStatus: 'Drip',
          soilMoisturePct: 45,
        },
      ],
    });

    setIsAddFarmOpen(false);
    setNewFarmName('');
  };

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockName || !blockAcres) return;

    addBlockToFarm(activeFarm.id, {
      name: blockName,
      acres: Number(blockAcres),
      currentCrop: blockCrop || 'Fallow / Green Manure',
      soilPh: Number(blockPh),
      irrigationStatus: blockIrrigation,
      soilMoisturePct: 48,
    });

    setIsAddBlockOpen(false);
    setBlockName('');
    setBlockCrop('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Farm Property & Field Block Registry</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage multi-farm real estate across Kenyan counties, tenure licenses, GPS boundary zoning, and soil characteristics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddBlockOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-white border border-emerald-700/30 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Field Block</span>
          </button>
          <button
            onClick={() => setIsAddFarmOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New Farm</span>
          </button>
        </div>
      </div>

      {/* Farms Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {farms.map((farm) => {
          const isSelected = farm.id === selectedFarmId;
          return (
            <div
              key={farm.id}
              className={`p-6 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-white border-emerald-700 ring-2 ring-emerald-600/30 shadow-md'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-neutral-900">{farm.name}</span>
                    {isSelected && (
                      <span className="text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                    <span className="font-mono text-neutral-600">{farm.code}</span>
                    <span aria-hidden="true">·</span>
                    <span>{farm.county} ({farm.subCounty})</span>
                  </div>
                </div>

                {!isSelected && (
                  <button
                    onClick={() => setSelectedFarmId(farm.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-emerald-800 hover:text-white rounded-lg transition-colors"
                  >
                    Select Farm
                  </button>
                )}
              </div>

              {/* Details Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 text-xs">
                <div className="p-2.5 rounded-lg bg-neutral-50">
                  <span className="text-neutral-500 text-[10px] uppercase block">Total Acreage</span>
                  <span className="font-bold font-mono text-neutral-900 tabular-nums">
                    {farm.totalAcres} Acres ({farm.totalHectares} Ha)
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50">
                  <span className="text-neutral-500 text-[10px] uppercase block">Farm Specialization</span>
                  <span className="font-medium text-neutral-800">{farm.farmType}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50">
                  <span className="text-neutral-500 text-[10px] uppercase block">Land Tenure</span>
                  <span className="font-medium text-neutral-800">{farm.ownershipType}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50">
                  <span className="text-neutral-500 text-[10px] uppercase block">Soil Profile</span>
                  <span className="font-medium text-neutral-800">{farm.soilType}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50">
                  <span className="text-neutral-500 text-[10px] uppercase block">Primary Water</span>
                  <span className="font-medium text-neutral-800">{farm.primaryWaterSource}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50">
                  <span className="text-neutral-500 text-[10px] uppercase block">GPS Coordinates</span>
                  <span className="font-mono text-[11px] text-neutral-800">{farm.gpsCoordinates}</span>
                </div>
              </div>

              {/* Manager & Contact */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Manager: <strong>{farm.managerName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-neutral-500">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{farm.managerPhone}</span>
                </div>
              </div>

              {/* Block List summary */}
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Cultivated Blocks ({farm.blocks.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {farm.blocks.map((blk) => (
                    <span
                      key={blk.id}
                      className="text-[11px] bg-neutral-100 text-neutral-700 px-2 py-1 rounded border border-neutral-200"
                    >
                      {blk.name} ({blk.acres} Ac - {blk.currentCrop || 'Fallow'})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Register New Farm */}
      {isAddFarmOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Register New Farm Operation</h3>
              <button onClick={() => setIsAddFarmOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFarm} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Farm Name *</label>
                  <input
                    required
                    type="text"
                    value={newFarmName}
                    onChange={(e) => setNewFarmName(e.target.value)}
                    placeholder="e.g. Mount Kenya Horticultural Ranch"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Unique Farm Code</label>
                  <input
                    type="text"
                    value={newFarmCode}
                    onChange={(e) => setNewFarmCode(e.target.value)}
                    placeholder="e.g. AGR-MRU-005"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">County *</label>
                  <select
                    value={newCounty}
                    onChange={(e) => setNewCounty(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option>Nakuru</option>
                    <option>Uasin Gishu</option>
                    <option>Kiambu</option>
                    <option>Trans Nzoia</option>
                    <option>Meru</option>
                    <option>Machakos</option>
                    <option>Kilifi</option>
                    <option>Kericho</option>
                    <option>Bomet</option>
                    <option>Nandi</option>
                    <option>Nyeri</option>
                    <option>Murang’a</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Sub-County</label>
                  <input
                    type="text"
                    value={newSubCounty}
                    onChange={(e) => setNewSubCounty(e.target.value)}
                    placeholder="e.g. Imenti North"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Total Acres *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={newAcres}
                    onChange={(e) => setNewAcres(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Farm Specialization</label>
                  <select
                    value={newFarmType}
                    onChange={(e) => setNewFarmType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Commercial Mixed">Commercial Mixed</option>
                    <option value="Crop Production">Crop Production</option>
                    <option value="Dairy & Livestock">Dairy & Livestock</option>
                    <option value="Horticulture & Greenhouses">Horticulture & Greenhouses</option>
                    <option value="Tea & Coffee Estate">Tea & Coffee Estate</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Land Ownership Tenure</label>
                  <select
                    value={newOwnership}
                    onChange={(e) => setNewOwnership(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Freehold Title">Freehold Title</option>
                    <option value="Leasehold 99yr">Leasehold 99yr</option>
                    <option value="Agricultural Trust">Agricultural Trust</option>
                    <option value="Customary">Customary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Soil Type</label>
                  <select
                    value={newSoilType}
                    onChange={(e) => setNewSoilType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Volcanic Loam">Volcanic Loam</option>
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Black Cotton">Black Cotton</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Primary Water Source</label>
                  <select
                    value={newWaterSource}
                    onChange={(e) => setNewWaterSource(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Solar Borehole">Solar Borehole</option>
                    <option value="River Intake">River Intake</option>
                    <option value="Earth Dam">Earth Dam</option>
                    <option value="Municipal Pipe">Municipal Pipe</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">GPS Coordinates</label>
                  <input
                    type="text"
                    value={newGps}
                    onChange={(e) => setNewGps(e.target.value)}
                    placeholder="0.0451° S, 37.6542° E"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Farm Manager Name</label>
                  <input
                    type="text"
                    value={newManagerName}
                    onChange={(e) => setNewManagerName(e.target.value)}
                    placeholder="e.g. Gladys Muthoni"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Manager Phone (M-Pesa)</label>
                  <input
                    type="text"
                    value={newManagerPhone}
                    onChange={(e) => setNewManagerPhone(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Operational Notes & Infrastructure</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Details on irrigation pumps, silage bunkers, packing shed..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddFarmOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save & Register Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Block to Active Farm */}
      {isAddBlockOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Add Land Block / Zone</h3>
              <button onClick={() => setIsAddBlockOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBlock} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Block Designation Name *</label>
                <input
                  required
                  type="text"
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  placeholder="e.g. Block D-1 (Avocado Expansion)"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Acres Allocated *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={blockAcres}
                    onChange={(e) => setBlockAcres(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Soil pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    value={blockPh}
                    onChange={(e) => setBlockPh(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Current Crop / Intended Use</label>
                <input
                  type="text"
                  value={blockCrop}
                  onChange={(e) => setBlockCrop(e.target.value)}
                  placeholder="e.g. Shangi Potatoes / Drip French Beans"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Irrigation System</label>
                <select
                  value={blockIrrigation}
                  onChange={(e) => setBlockIrrigation(e.target.value as any)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                >
                  <option value="Drip">Drip Irrigation</option>
                  <option value="Pivot">Center Pivot</option>
                  <option value="Sprinkler">Overhead Sprinkler</option>
                  <option value="Rainfed">Rainfed Only</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddBlockOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Attach Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
