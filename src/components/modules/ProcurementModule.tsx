import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Supplier, PurchaseOrder } from '../../types/index.ts';
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Clock,
  X,
  FileText,
} from 'lucide-react';

export const ProcurementModule: React.FC = () => {
  const { activeFarm, suppliers, addSupplier, purchaseOrders, addPurchaseOrder, formatMoney } = useApp();
  const farmPOs = purchaseOrders.filter((p) => p.farmId === activeFarm.id);

  const [activeTab, setActiveTab] = useState<'pos' | 'suppliers'>('pos');
  const [isAddPoOpen, setIsAddPoOpen] = useState(false);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);

  // New PO state
  const [poNumber, setPoNumber] = useState('');
  const [supplierName, setSupplierName] = useState(suppliers[0]?.name || 'Yara East Africa Ltd');
  const [itemName, setItemName] = useState('YaraBela SULFAN CAN 50kg Bags');
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState('Bags');
  const [unitCostKes, setUnitCostKes] = useState<number>(4200);

  // New Supplier state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Supplier['category']>('Fertilizers');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Nairobi / Nakuru Depot');
  const [paymentTerms, setPaymentTerms] = useState('30 Days Net');

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName || !itemName) return;

    addPurchaseOrder({
      farmId: activeFarm.id,
      poNumber: poNumber || `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierName,
      itemName,
      quantity: Number(quantity),
      unit,
      unitCostKes: Number(unitCostKes),
      totalAmountKes: Number(quantity) * Number(unitCostKes),
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Approved',
    });

    setIsAddPoOpen(false);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addSupplier({
      name,
      category,
      contactPerson,
      phone,
      email,
      location,
      paymentTerms,
    });

    setIsAddSupplierOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Suppliers & Agro-Input Procurement</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Certified seed distributors, fertilizer blenders, machinery suppliers, and purchase orders for {activeFarm.name}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddSupplierOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Supplier</span>
          </button>
          <button
            onClick={() => setIsAddPoOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl max-w-xs text-xs font-medium">
        <button
          onClick={() => setActiveTab('pos')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'pos' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Purchase Orders ({farmPOs.length})
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'suppliers' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Suppliers Directory ({suppliers.length})
        </button>
      </div>

      {/* Tab 1: Purchase Orders */}
      {activeTab === 'pos' ? (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Item Ordered</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Unit Cost (KES)</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {farmPOs.map((po) => (
                <tr key={po.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-neutral-900">{po.poNumber}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{po.orderDate}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-neutral-800">{po.supplierName}</td>
                  <td className="py-3 px-4 font-medium text-emerald-900">{po.itemName}</td>
                  <td className="py-3 px-4 font-mono font-semibold tabular-nums text-neutral-900">
                    {po.quantity.toLocaleString()} {po.unit}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-neutral-700">
                    KES {po.unitCostKes.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800 tabular-nums">
                    {formatMoney(po.totalAmountKes)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        po.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Tab 2: Supplier Directory */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((sup) => (
            <div key={sup.id} className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between pb-2 border-b border-neutral-100">
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">{sup.name}</h4>
                  <span className="text-[11px] font-mono text-emerald-800 font-semibold">{sup.category}</span>
                </div>
                <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-medium">
                  {sup.paymentTerms}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{sup.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-mono text-neutral-800">{sup.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{sup.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Issue Purchase Order */}
      {isAddPoOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Issue Purchase Order</h3>
              <button onClick={() => setIsAddPoOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePo} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Select Supplier *</label>
                <select
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Item Required *</label>
                <input
                  required
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Kenya Seed Maize H614D 25kg"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Quantity *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
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
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex justify-between items-center font-bold">
                <span>Calculated PO Total:</span>
                <span className="font-mono text-emerald-800 text-sm">
                  {formatMoney(Number(quantity) * Number(unitCostKes))}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddPoOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Supplier */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Add Certified Supplier</h3>
              <button onClick={() => setIsAddSupplierOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Company / Supplier Name *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elgon Kenya Ltd"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Certified Seeds">Certified Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Crop Protection Chemicals">Crop Protection Chemicals</option>
                    <option value="Veterinary Supplies">Veterinary Supplies</option>
                    <option value="Irrigation Equipment">Irrigation Equipment</option>
                    <option value="Animal Feeds">Animal Feeds</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Sales Manager"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sales@supplier.co.ke"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Location & Payment Terms</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Nakuru Showground / 30 Days Net"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
