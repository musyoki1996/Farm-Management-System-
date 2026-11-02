import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { InventoryItem } from '../../types/index.ts';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  X,
  Package,
  Layers,
  Calendar,
} from 'lucide-react';

export const InventoryModule: React.FC = () => {
  const { activeFarm, inventory, addInventoryItem, updateInventoryStock, formatMoney } = useApp();
  const farmInventory = inventory.filter((i) => i.farmId === activeFarm.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [selectedItemForStockMove, setSelectedItemForStockMove] = useState<InventoryItem | null>(null);
  const [stockDelta, setStockDelta] = useState<number>(10);
  const [stockMoveType, setStockMoveType] = useState<'in' | 'out'>('out');
  const [stockReason, setStockReason] = useState('Applied to Block A-1');

  // New Item form state
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Fertilizers & Lime');
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState('50kg Bags');
  const [unitCostKes, setUnitCostKes] = useState<number>(4200);
  const [reorderLevel, setReorderLevel] = useState<number>(20);
  const [batchNo, setBatchNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [supplier, setSupplier] = useState('Yara East Africa Ltd');
  const [locationStorage, setLocationStorage] = useState('Main Agro-Store Rack B');

  const filteredItems = farmInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalValuation = farmInventory.reduce((a, b) => a + b.totalValuationKes, 0);
  const lowStockItems = farmInventory.filter((i) => i.quantity <= i.reorderLevel);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !unitCostKes) return;

    addInventoryItem({
      farmId: activeFarm.id,
      sku: sku || `SKU-${category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name,
      category,
      quantity: Number(quantity),
      unit,
      unitCostKes: Number(unitCostKes),
      reorderLevel: Number(reorderLevel),
      batchNo: batchNo || `BT-${Date.now().toString().slice(-5)}`,
      expiryDate,
      supplier,
      locationStorage,
    });

    setIsAddItemOpen(false);
    setName('');
    setSku('');
  };

  const handleExecuteStockMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForStockMove || stockDelta <= 0) return;

    const delta = stockMoveType === 'in' ? Number(stockDelta) : -Number(stockDelta);
    updateInventoryStock(selectedItemForStockMove.id, delta, stockReason);
    setSelectedItemForStockMove(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Farm Input Stores & Inventory Valuation</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time stock ledger for certified seeds, fertilizers, agrochemicals, feeds, and harvested produce on {activeFarm.name}.
          </p>
        </div>
        <button
          onClick={() => setIsAddItemOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Inventory Item</span>
        </button>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Total Store Valuation</span>
          <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            {formatMoney(totalValuation)}
          </span>
          <span className="text-xs text-neutral-500 block mt-1">{farmInventory.length} managed stock lines</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Low Stock Alerts</span>
          <span className="text-2xl font-bold font-mono text-amber-700 tabular-nums">
            {lowStockItems.length} Items Below Reorder
          </span>
          <span className="text-xs text-neutral-500 block mt-1">Prompt supplier purchase orders</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Harvested Grain Reserve</span>
          <span className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
            3,200 Bags (Maize)
          </span>
          <span className="text-xs text-neutral-500 block mt-1">In main warehouse silo (KES 3,400/bag)</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search stock by name, SKU, or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-neutral-100 rounded-lg text-xs">
          {['all', 'Seeds & Seedlings', 'Fertilizers & Lime', 'Crop Protection Chemicals', 'Animal Feeds & Salt', 'Fuel & Lubricants'].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                categoryFilter === c ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {c === 'all' ? 'All Categories' : c.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Item Details & SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4">Unit Cost (KES)</th>
              <th className="py-3 px-4">Total Value</th>
              <th className="py-3 px-4">Batch / Expiry</th>
              <th className="py-3 px-4 text-right">Stock Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredItems.map((item) => {
              const isLow = item.quantity <= item.reorderLevel;
              return (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-neutral-900">{item.name}</div>
                    <div className="text-[10px] font-mono text-neutral-400 mt-0.5">{item.sku} · {item.locationStorage}</div>
                  </td>
                  <td className="py-3 px-4 text-neutral-600">{item.category}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold font-mono text-neutral-900 tabular-nums">
                      {item.quantity.toLocaleString()} {item.unit}
                    </div>
                    {isLow && (
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                        Low Stock (Min {item.reorderLevel})
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-neutral-800">
                    KES {item.unitCostKes.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800 tabular-nums">
                    {formatMoney(item.totalValuationKes)}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">
                    <div>{item.batchNo}</div>
                    <div className="text-[10px] text-neutral-400">{item.expiryDate ? `Exp: ${item.expiryDate}` : 'No expiry'}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedItemForStockMove(item);
                        setStockDelta(10);
                        setStockMoveType('out');
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                    >
                      Stock In / Out
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: Add Inventory Item */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Register New Inventory Item</h3>
              <button onClick={() => setIsAddItemOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Item Commercial Name *</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. YaraBela SULFAN CAN 24%"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">SKU / Item Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. FERT-CAN-50"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
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
                    <option value="Seeds & Seedlings">Seeds & Seedlings</option>
                    <option value="Fertilizers & Lime">Fertilizers & Lime</option>
                    <option value="Crop Protection Chemicals">Crop Protection Chemicals</option>
                    <option value="Animal Feeds & Salt">Animal Feeds & Salt</option>
                    <option value="Veterinary Drugs">Veterinary Drugs</option>
                    <option value="Tools & Spares">Tools & Spares</option>
                    <option value="Fuel & Lubricants">Fuel & Lubricants</option>
                    <option value="Harvested Produce">Harvested Produce</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Packaging Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. 50kg Bags / Litres / Vials"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Initial Quantity *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Unit Cost (KES) *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={unitCostKes}
                    onChange={(e) => setUnitCostKes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Reorder Threshold</label>
                  <input
                    type="number"
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    placeholder="e.g. BT-2026-99"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Supplier Name</label>
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Storage Location in Farm</label>
                  <input
                    type="text"
                    value={locationStorage}
                    onChange={(e) => setLocationStorage(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Register Stock Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Stock Movement (Stock-In / Stock-Out) */}
      {selectedItemForStockMove && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">
                Stock Movement: {selectedItemForStockMove.name}
              </h3>
              <button onClick={() => setSelectedItemForStockMove(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteStockMove} className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
                <div>
                  <div className="text-neutral-500 text-[10px] uppercase">Current Store Balance</div>
                  <div className="text-base font-bold font-mono text-neutral-900 tabular-nums">
                    {selectedItemForStockMove.quantity} {selectedItemForStockMove.unit}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-neutral-500 text-[10px] uppercase">Unit Value</div>
                  <div className="text-sm font-mono font-semibold text-emerald-800 tabular-nums">
                    KES {selectedItemForStockMove.unitCostKes.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Movement Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStockMoveType('out')}
                    className={`py-2 text-center rounded-lg font-semibold border ${
                      stockMoveType === 'out'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-300'
                    }`}
                  >
                    Stock Out (Issue to Field)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockMoveType('in')}
                    className={`py-2 text-center rounded-lg font-semibold border ${
                      stockMoveType === 'in'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-white text-neutral-700 border-neutral-300'
                    }`}
                  >
                    Stock In (Receive Delivery)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Quantity to {stockMoveType === 'in' ? 'Add' : 'Deduct'} ({selectedItemForStockMove.unit}) *
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={stockDelta}
                  onChange={(e) => setStockDelta(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Operational Purpose / Destination</label>
                <input
                  type="text"
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  placeholder="e.g. Applied to Block B-1 French Beans / New delivery GRN-104"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setSelectedItemForStockMove(null)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
