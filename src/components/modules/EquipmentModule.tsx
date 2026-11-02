import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Equipment } from '../../types/index.ts';
import {
  Wrench,
  Plus,
  Tractor,
  Fuel,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Gauge,
} from 'lucide-react';

export const EquipmentModule: React.FC = () => {
  const { activeFarm, equipment, addEquipment, updateEquipment } = useApp();
  const farmEquipment = equipment.filter((e) => e.farmId === activeFarm.id);

  const [isAddEqOpen, setIsAddEqOpen] = useState(false);
  const [selectedEqForService, setSelectedEqForService] = useState<Equipment | null>(null);

  // New Equipment state
  const [assetCode, setAssetCode] = useState('');
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState<Equipment['category']>('Tractors');
  const [operatingHours, setOperatingHours] = useState<number>(100);
  const [fuelConsumptionLph, setFuelConsumptionLph] = useState<number>(7.0);
  const [lastServiceDate, setLastServiceDate] = useState('2026-09-01');
  const [nextServiceHours, setNextServiceHours] = useState<number>(300);
  const [assignedOperator, setAssignedOperator] = useState('Lead Fleet Driver');

  // Service form state
  const [newOperatingHours, setNewOperatingHours] = useState<number>(0);
  const [serviceNotes, setServiceNotes] = useState('1500-Hour Oil & Filter Change');

  const handleCreateEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addEquipment({
      farmId: activeFarm.id,
      assetCode: assetCode || `EQP-${Math.floor(100 + Math.random() * 900)}`,
      name,
      model,
      category,
      status: 'Operational',
      operatingHours: Number(operatingHours),
      fuelConsumptionLph: Number(fuelConsumptionLph),
      lastServiceDate,
      nextServiceHours: Number(nextServiceHours),
      assignedOperator,
    });

    setIsAddEqOpen(false);
    setName('');
    setModel('');
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEqForService) return;

    updateEquipment({
      ...selectedEqForService,
      operatingHours: Number(newOperatingHours || selectedEqForService.operatingHours),
      lastServiceDate: new Date().toISOString().split('T')[0],
      nextServiceHours: Number(newOperatingHours || selectedEqForService.operatingHours) + 250,
      status: 'Operational',
    });

    setSelectedEqForService(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Farm Equipment, Machinery & Fleet</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Tractors, combine harvesters, solar boreholes, and fuel consumption telemetry for {activeFarm.name}.
          </p>
        </div>
        <button
          onClick={() => setIsAddEqOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Machinery</span>
        </button>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {farmEquipment.map((eq) => {
          const hoursLeft = eq.nextServiceHours - eq.operatingHours;
          const isServiceDue = hoursLeft <= 50;

          return (
            <div key={eq.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-neutral-900">{eq.name}</span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5 font-mono">
                    {eq.assetCode} · {eq.model}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    eq.status === 'Operational'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {eq.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs bg-neutral-50 p-3 rounded-xl">
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block">Runtime Hours</span>
                  <span className="font-bold font-mono text-neutral-900 tabular-nums text-sm">
                    {eq.operatingHours.toLocaleString()} hrs
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block">Fuel Burn</span>
                  <span className="font-bold font-mono text-neutral-900 tabular-nums text-sm">
                    {eq.fuelConsumptionLph ? `${eq.fuelConsumptionLph} L/hr` : 'Electric / Solar'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block">Next Service</span>
                  <span
                    className={`font-bold font-mono tabular-nums text-sm ${
                      isServiceDue ? 'text-red-700' : 'text-emerald-800'
                    }`}
                  >
                    {eq.nextServiceHours} hrs
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                <div>
                  Assigned Driver: <strong>{eq.assignedOperator}</strong>
                </div>
                <button
                  onClick={() => {
                    setSelectedEqForService(eq);
                    setNewOperatingHours(eq.operatingHours + 15);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Log Service</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Equipment */}
      {isAddEqOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Register Machinery Asset</h3>
              <button onClick={() => setIsAddEqOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEquipment} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Equipment Name *</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Deere 5075E 4WD"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Model / Serial No</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. 5075E Turbo MFWD"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Tractors">Tractors</option>
                    <option value="Harvesters & Threshers">Harvesters & Threshers</option>
                    <option value="Boom Sprayers & Planters">Boom Sprayers & Planters</option>
                    <option value="Water Pumps & Generators">Water Pumps & Generators</option>
                    <option value="Transport Vehicles">Transport Vehicles</option>
                    <option value="Dairy Milling Equipment">Dairy Milling Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Assigned Operator</label>
                  <input
                    type="text"
                    value={assignedOperator}
                    onChange={(e) => setAssignedOperator(e.target.value)}
                    placeholder="e.g. Jackson Mwita"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Operating Hours</label>
                  <input
                    type="number"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Fuel Consumption (L/hr)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fuelConsumptionLph}
                    onChange={(e) => setFuelConsumptionLph(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Next Service Due (hrs)</label>
                  <input
                    type="number"
                    value={nextServiceHours}
                    onChange={(e) => setNextServiceHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddEqOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Service */}
      {selectedEqForService && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">
                Log Service & Maintenance: {selectedEqForService.name}
              </h3>
              <button onClick={() => setSelectedEqForService(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Current Odometer / Hour Meter *</label>
                <input
                  required
                  type="number"
                  value={newOperatingHours}
                  onChange={(e) => setNewOperatingHours(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Service Operations Performed</label>
                <textarea
                  rows={3}
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  placeholder="e.g. Engine oil replaced (15W-40), fuel filter changed, hydraulic arm greased..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setSelectedEqForService(null)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
