import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { SalesOrder } from '../../types/index.ts';
import {
  ShoppingBag,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Truck,
  X,
  FileText,
  DollarSign,
} from 'lucide-react';

export const SalesModule: React.FC = () => {
  const { activeFarm, salesOrders, addSalesOrder, updateSalesOrder, commodityPrices, formatMoney } = useApp();
  const farmOrders = salesOrders.filter((s) => s.farmId === activeFarm.id);

  const [activeTab, setActiveTab] = useState<'orders' | 'market'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);

  // New Order state
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('Brookside Dairy Kenya Ltd');
  const [customerType, setCustomerType] = useState<SalesOrder['customerType']>('Dairy Processor');
  const [product, setProduct] = useState('Chilled Raw Cow Milk');
  const [quantity, setQuantity] = useState<number>(25000);
  const [unit, setUnit] = useState('Litres');
  const [unitPriceKes, setUnitPriceKes] = useState<number>(54);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryStatus, setDeliveryStatus] = useState<SalesOrder['deliveryStatus']>('Delivered');
  const [paymentStatus, setPaymentStatus] = useState<SalesOrder['paymentStatus']>('Paid');
  const [paymentRef, setPaymentRef] = useState('');

  const totalSalesRevenue = farmOrders.reduce((a, b) => a + b.totalAmountKes, 0);

  const filteredOrders = farmOrders.filter((o) => {
    return (
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.product.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !product) return;

    const total = Number(quantity) * Number(unitPriceKes);
    addSalesOrder({
      farmId: activeFarm.id,
      orderNumber: orderNumber || `SO-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      customerType,
      product,
      quantity: Number(quantity),
      unit,
      unitPriceKes: Number(unitPriceKes),
      totalAmountKes: total,
      orderDate,
      deliveryStatus,
      paymentStatus,
      paymentRef: paymentRef || `EFT-SALES-${Date.now().toString().slice(-5)}`,
    });

    setIsAddOrderOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Farm Produce Sales & Market Intelligence</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Commercial dispatch orders to processors, export aggregators, wholesale markets, and live Kenyan commodity prices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors ${
              activeTab === 'market'
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-white text-emerald-900 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            Live Kenya Market Prices
          </button>
          <button
            onClick={() => setIsAddOrderOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sales Order</span>
          </button>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Total Produce Invoiced</span>
          <span className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
            {formatMoney(totalSalesRevenue)}
          </span>
          <span className="text-xs text-neutral-500 block mt-1">{farmOrders.length} commercial dispatches</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Milk Offtake Realization</span>
          <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            KES 54.00 / Litre
          </span>
          <span className="text-xs text-emerald-700 block mt-1">Brookside contract price</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Export French Beans</span>
          <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            KES 120.00 / kg
          </span>
          <span className="text-xs text-neutral-500 block mt-1">East African Growers FOB</span>
        </div>
      </div>

      {/* Tab: Sales Orders */}
      {activeTab === 'orders' ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, customers, or produce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
            <span className="text-xs text-neutral-500 font-mono">
              Total Dispatched: {filteredOrders.length} Invoices
            </span>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Customer & Channel</th>
                  <th className="py-3 px-4">Produce Details</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Total Amount (KES)</th>
                  <th className="py-3 px-4 text-right">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((so) => (
                  <tr key={so.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-neutral-900">{so.orderNumber}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{so.orderDate}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-800">{so.customerName}</div>
                      <div className="text-[10px] text-neutral-500">{so.customerType}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-emerald-900">{so.product}</td>
                    <td className="py-3 px-4 font-mono font-semibold tabular-nums text-neutral-900">
                      {so.quantity.toLocaleString()} {so.unit}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-neutral-700">
                      KES {so.unitPriceKes.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800 tabular-nums">
                      {formatMoney(so.totalAmountKes)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          so.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {so.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab: Kenya Wholesale Commodity Market Prices */
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <div>
              <h3 className="font-bold text-base text-neutral-900">Live Kenyan Commodity Market Benchmark</h3>
              <p className="text-xs text-neutral-500">
                Daily wholesale and retail price averages across Nairobi (Wakulima), Mombasa (Kongowea), Nakuru, and Eldoret.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded">
              Updated Daily at 06:00 EAT
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Agricultural Commodity</th>
                <th className="py-3 px-4">Trading Hub / Market</th>
                <th className="py-3 px-4">Standard Trade Unit</th>
                <th className="py-3 px-4">Wholesale Price (KES)</th>
                <th className="py-3 px-4">Retail Price (KES)</th>
                <th className="py-3 px-4 text-right">Daily Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {commodityPrices.map((item, idx) => (
                <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-neutral-900">{item.crop}</td>
                  <td className="py-3 px-4 text-neutral-700 font-medium">{item.market}</td>
                  <td className="py-3 px-4 font-mono text-neutral-600">{item.unit}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800 tabular-nums">
                    KES {item.wholesaleKes.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-neutral-800 tabular-nums">
                    KES {item.retailKes.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-xs font-semibold ${
                        item.changePct >= 0 ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {item.changePct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      <span>{item.changePct > 0 ? `+${item.changePct}%` : `${item.changePct}%`}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: New Sales Order */}
      {isAddOrderOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Generate Produce Sales Dispatch</h3>
              <button onClick={() => setIsAddOrderOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Customer / Offtaker Name *</label>
                  <input
                    required
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Brookside Dairy / Twiga Foods"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Customer Category</label>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Dairy Processor">Dairy Processor</option>
                    <option value="Export Aggregator">Export Aggregator</option>
                    <option value="Wholesale Market">Wholesale Market</option>
                    <option value="Supermarket Chain">Supermarket Chain</option>
                    <option value="Farmer Cooperative">Farmer Cooperative</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Produce Description *</label>
                <input
                  required
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. French Beans Serengeti Extra Fine"
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
                    placeholder="Litres / Kg / Bags"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Unit Price (KES) *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={unitPriceKes}
                    onChange={(e) => setUnitPriceKes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Paid">Paid in Full</option>
                    <option value="Partial">Partial Deposit Received</option>
                    <option value="Pending Net-30">Pending Net-30 Invoice</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Payment Reference / M-Pesa</label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="e.g. QK89104821 / EFT-991"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex justify-between items-center font-bold">
                <span>Calculated Invoice Total:</span>
                <span className="font-mono text-emerald-800 text-sm">
                  {formatMoney(Number(quantity) * Number(unitPriceKes))}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddOrderOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Generate Sales Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
