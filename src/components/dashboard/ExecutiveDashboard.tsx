import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Tractor,
  Sprout,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Layers,
  Milk,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  Calendar,
  CloudSun,
  ShieldCheck,
  ChevronRight,
  MapPin,
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const {
    activeFarm,
    farms,
    crops,
    livestock,
    milkLogs,
    inventory,
    transactions,
    tasks,
    weatherData,
    formatMoney,
    setCurrentView,
  } = useApp();

  const [productionFilter, setProductionFilter] = useState<'all' | 'crops' | 'livestock' | 'finance'>('all');

  // Filter entities by active farm
  const farmCrops = crops.filter((c) => c.farmId === activeFarm.id);
  const farmLivestock = livestock.filter((l) => l.farmId === activeFarm.id);
  const farmMilk = milkLogs.filter((m) => m.farmId === activeFarm.id);
  const farmInventory = inventory.filter((i) => i.farmId === activeFarm.id);
  const farmTx = transactions.filter((t) => t.farmId === activeFarm.id);
  const farmTasks = tasks.filter((t) => t.farmId === activeFarm.id);

  // Financial calculations
  const totalRevenueKes = farmTx
    .filter((t) => t.type === 'Income')
    .reduce((acc, t) => acc + t.amountKes, 0);

  const totalExpenseKes = farmTx
    .filter((t) => t.type === 'Expense')
    .reduce((acc, t) => acc + t.amountKes, 0);

  const netProfitKes = totalRevenueKes - totalExpenseKes;

  const totalInventoryValuationKes = farmInventory.reduce(
    (acc, item) => acc + item.totalValuationKes,
    0
  );

  const pendingTasks = farmTasks.filter((t) => t.status !== 'Completed');
  const activeCropCycles = farmCrops.filter((c) => c.status !== 'Completed');

  // Total daily milk volume across last logged day
  const latestMilkToday = farmMilk[0]?.totalLitres || 0;

  return (
    <div className="space-y-6">
      {/* Top Banner: Farm Status & Microclimate Advisory */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <span>{activeFarm.farmType}</span>
              <span aria-hidden="true">·</span>
              <span>{activeFarm.county} County ({activeFarm.subCounty})</span>
              <span aria-hidden="true">·</span>
              <span>{activeFarm.ownershipType}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
              {activeFarm.name}
            </h2>
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
              {activeFarm.notes || 'Integrated enterprise production tracking crops, high-yield dairy, and export horticultural blocks.'}
            </p>
          </div>

          <div className="lg:col-span-5 bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <CloudSun className="w-4 h-4" />
                <span>Agro-Meteorological Advisory</span>
              </span>
              <span className="font-mono text-neutral-700">{weatherData.temperatureC}°C · {weatherData.humidity}% RH</span>
            </div>
            <p className="text-xs text-neutral-800 leading-relaxed font-medium">
              {weatherData.advisory}
            </p>
            <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1 border-t border-neutral-200/60">
              <span>Rain 7-Day: <strong className="font-mono text-neutral-800">{weatherData.rainfall7DaysMm} mm</strong></span>
              <span>Soil Moisture: <strong className="font-mono text-emerald-700">{weatherData.soilMoisturePct}% VWC</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Production Domain Filter Controls (Functional Button Tabs) */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 p-1 bg-neutral-200/70 rounded-lg">
          <button
            onClick={() => setProductionFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              productionFilter === 'all'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All Operations
          </button>
          <button
            onClick={() => setProductionFilter('crops')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              productionFilter === 'crops'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Crops & Horticulture
          </button>
          <button
            onClick={() => setProductionFilter('livestock')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              productionFilter === 'livestock'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Livestock & Dairy
          </button>
          <button
            onClick={() => setProductionFilter('finance')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
              productionFilter === 'finance'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Financials & Cash Flow
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span>Active Farm Registry: <strong>{farms.length} Properties</strong></span>
          <span aria-hidden="true">·</span>
          <span>Cultivated Area: <strong className="font-mono text-neutral-900">{activeFarm.totalAcres} Acres</strong> ({activeFarm.totalHectares} Ha)</span>
        </div>
      </div>

      {/* Primary KPI Grid (All figures use tabular-nums) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Net Farm Profit */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Net Farm Profit (Season)</span>
            <div className={`p-1.5 rounded-lg ${netProfitKes >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
              {formatMoney(netProfitKes)}
            </div>
            <div className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-700 font-semibold font-mono tabular-nums">
                +{Math.round((netProfitKes / (totalRevenueKes || 1)) * 100)}%
              </span>
              <span>operating margin</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Inflow: {formatMoney(totalRevenueKes)}</span>
            <span>Outflow: {formatMoney(totalExpenseKes)}</span>
          </div>
        </div>

        {/* KPI 2: Active Crop Production */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Active Crop Cycles</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
              {activeCropCycles.length} Cycles
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Planted on <span className="font-mono font-semibold text-neutral-800">{activeCropCycles.reduce((a, b) => a + b.acresPlanted, 0)}</span> allocated acres
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
            <span className="text-neutral-500">Blocks: {activeFarm.blocks.length} active</span>
            <button
              onClick={() => setCurrentView('crops')}
              className="font-semibold text-emerald-800 hover:underline flex items-center gap-0.5"
            >
              <span>View Cycles</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* KPI 3: Daily Dairy & Livestock Output */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Daily Milk Collection</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <Milk className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
              {latestMilkToday.toLocaleString()} Litres
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Herd: <span className="font-mono font-semibold text-neutral-800">{farmLivestock.length} animals</span> registered
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
            <span className="text-neutral-500">Quality: 3.88% Butterfat</span>
            <button
              onClick={() => setCurrentView('livestock')}
              className="font-semibold text-emerald-800 hover:underline flex items-center gap-0.5"
            >
              <span>Log Milk</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* KPI 4: Inventory Stores Valuation */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Store Valuation</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
              {formatMoney(totalInventoryValuationKes)}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              <span className="font-mono font-semibold text-neutral-800">{farmInventory.length} item lines</span> in store
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
            <span className="text-amber-700 font-medium">Reorders: 2 low stock</span>
            <button
              onClick={() => setCurrentView('inventory')}
              className="font-semibold text-emerald-800 hover:underline flex items-center gap-0.5"
            >
              <span>Stores</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Production Analysis & Operations Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Production Cycle Progress & Field Blocks */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Field Blocks Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Land Blocks & Field Zoning</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Real-time status across {activeFarm.blocks.length} cultivated zones</p>
              </div>
              <button
                onClick={() => setCurrentView('farms')}
                className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>Manage Blocks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Block Designation</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Current Crop / Utilization</th>
                    <th className="py-2.5 px-3">Soil pH</th>
                    <th className="py-2.5 px-3">Irrigation</th>
                    <th className="py-2.5 px-3 text-right">Moisture %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {activeFarm.blocks.map((blk) => (
                    <tr key={blk.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-neutral-900">{blk.name}</td>
                      <td className="py-3 px-3 font-mono tabular-nums text-neutral-700">{blk.acres} Acres</td>
                      <td className="py-3 px-3 text-emerald-900 font-medium">{blk.currentCrop || 'Fallow / Rest'}</td>
                      <td className="py-3 px-3 font-mono tabular-nums">{blk.soilPh.toFixed(1)}</td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                          {blk.irrigationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-neutral-800">
                        {blk.soilMoisturePct}% VWC
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Crop Cycles Performance */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Current Crop Cycles & Target Yields</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Tracking vegetative growth, fertilizer cost and harvest estimates</p>
              </div>
              <button
                onClick={() => setCurrentView('crops')}
                className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>Add Crop Cycle</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {farmCrops.map((crop) => {
                const targetBags = Math.round(crop.targetYieldKg / 90);
                const actualBags = crop.actualYieldKg ? Math.round(crop.actualYieldKg / 90) : 0;
                return (
                  <div key={crop.id} className="p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-neutral-900">{crop.cropName}</span>
                          <span className="text-xs font-mono text-neutral-500">({crop.variety})</span>
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          Location: <strong>{crop.blockName}</strong> · Planted: <span className="font-mono">{crop.plantingDate}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {crop.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-neutral-50 p-3 rounded-lg">
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase">Planted Area</span>
                        <span className="font-bold font-mono text-neutral-900 tabular-nums">{crop.acresPlanted} Acres</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase">Target Yield</span>
                        <span className="font-bold font-mono text-neutral-900 tabular-nums">
                          {crop.targetYieldKg.toLocaleString()} kg (~{targetBags.toLocaleString()} bags)
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase">Production Cost</span>
                        <span className="font-bold font-mono text-neutral-900 tabular-nums">{formatMoney(crop.totalCostKes)}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px] uppercase">Expected Harvest</span>
                        <span className="font-bold font-mono text-neutral-900 tabular-nums">{crop.expectedHarvestDate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Operational Tasks & Recent Financial Entries */}
        <div className="lg:col-span-4 space-y-6">
          {/* Operations & Urgent Tasks */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-800" />
                <h3 className="text-sm font-bold text-neutral-900">Priority Farm Tasks</h3>
              </div>
              <button
                onClick={() => setCurrentView('tasks')}
                className="text-xs font-semibold text-emerald-800 hover:underline"
              >
                All Tasks ({pendingTasks.length})
              </button>
            </div>

            <div className="space-y-3">
              {pendingTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        task.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'High'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">Due {task.dueDate}</span>
                  </div>
                  <div className="font-semibold text-neutral-900">{task.title}</div>
                  <div className="text-[11px] text-neutral-500 flex items-center justify-between">
                    <span>Assigned: {task.assignedTo.split(' ')[0]}</span>
                    <span className="font-mono text-neutral-600">{task.estimatedHours} hrs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Financial Transactions & M-Pesa Log */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-800" />
                <h3 className="text-sm font-bold text-neutral-900">Recent Transactions</h3>
              </div>
              <button
                onClick={() => setCurrentView('finance')}
                className="text-xs font-semibold text-emerald-800 hover:underline"
              >
                Ledger
              </button>
            </div>

            <div className="space-y-3">
              {farmTx.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between text-xs pb-2 border-b border-neutral-100 last:border-b-0">
                  <div className="max-w-[170px]">
                    <div className="font-semibold text-neutral-900 truncate">{tx.category}</div>
                    <div className="text-[10px] text-neutral-500 truncate">{tx.description}</div>
                    <div className="text-[9px] font-mono text-emerald-700 mt-0.5">{tx.paymentMethod}</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold font-mono tabular-nums ${
                        tx.type === 'Income' ? 'text-emerald-700' : 'text-neutral-900'
                      }`}
                    >
                      {tx.type === 'Income' ? '+' : '-'} {formatMoney(tx.amountKes)}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400">{tx.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
