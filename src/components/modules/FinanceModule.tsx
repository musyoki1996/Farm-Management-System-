import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { FinancialTransaction } from '../../types/index.ts';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Smartphone,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers,
  X,
  CreditCard,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const FinanceModule: React.FC = () => {
  const {
    activeFarm,
    transactions,
    addTransaction,
    simulateMpesa,
    formatMoney,
    currency,
  } = useApp();

  const farmTx = transactions.filter((t) => t.farmId === activeFarm.id);

  const [activeTab, setActiveTab] = useState<'ledger' | 'pnl' | 'mpesa'>('ledger');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Transaction Modal
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [txType, setTxType] = useState<FinancialTransaction['type']>('Expense');
  const [category, setCategory] = useState('Labor & Wages');
  const [description, setDescription] = useState('');
  const [amountKes, setAmountKes] = useState<number>(45000);
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<FinancialTransaction['paymentMethod']>('M-Pesa B2C');
  const [referenceNo, setReferenceNo] = useState('');
  const [payeeOrPayer, setPayeeOrPayer] = useState('');

  // M-Pesa Simulator Modal / Form state
  const [mpesaType, setMpesaType] = useState<'B2C' | 'C2B'>('B2C');
  const [mpesaPhone, setMpesaPhone] = useState('254712345678');
  const [mpesaAmount, setMpesaAmount] = useState<number>(15000);
  const [mpesaRecipient, setMpesaRecipient] = useState('Farm Casual Workers');
  const [mpesaRef, setMpesaRef] = useState('WAGES-BLK-A1');
  const [isProcessingMpesa, setIsProcessingMpesa] = useState(false);
  const [mpesaResponse, setMpesaResponse] = useState<any>(null);

  // Filtered transactions
  const filteredTx = farmTx.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.payeeOrPayer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.referenceNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  // Calculations
  const totalIncome = farmTx
    .filter((t) => t.type === 'Income')
    .reduce((a, b) => a + b.amountKes, 0);

  const totalExpense = farmTx
    .filter((t) => t.type === 'Expense')
    .reduce((a, b) => a + b.amountKes, 0);

  const netProfit = totalIncome - totalExpense;

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amountKes) return;

    addTransaction({
      farmId: activeFarm.id,
      type: txType,
      category,
      description: description || `${txType} entry for ${category}`,
      amountKes: Number(amountKes),
      date: txDate,
      paymentMethod,
      referenceNo: referenceNo || `TX-${Date.now().toString().slice(-6)}`,
      status: 'Completed',
      payeeOrPayer: payeeOrPayer || (txType === 'Income' ? 'Customer' : 'Supplier'),
    });

    setIsAddTxOpen(false);
    setDescription('');
    setPayeeOrPayer('');
    setReferenceNo('');
  };

  const handleExecuteMpesa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingMpesa(true);
    setMpesaResponse(null);

    const result = await simulateMpesa(
      mpesaType,
      Number(mpesaAmount),
      mpesaPhone,
      mpesaRef,
      mpesaRecipient
    );

    setIsProcessingMpesa(false);
    setMpesaResponse(result);

    // Auto log transaction to general ledger
    addTransaction({
      farmId: activeFarm.id,
      type: mpesaType === 'B2C' ? 'Expense' : 'Income',
      category: mpesaType === 'B2C' ? 'Labor & Wages' : 'Produce Sales',
      description: `M-Pesa Daraja ${mpesaType}: ${mpesaRef} (${mpesaRecipient})`,
      amountKes: Number(mpesaAmount),
      date: new Date().toISOString().split('T')[0],
      paymentMethod: mpesaType === 'B2C' ? 'M-Pesa B2C' : 'M-Pesa Paybill',
      referenceNo: result?.TransactionID || `QK${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'Completed',
      payeeOrPayer: mpesaRecipient,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Agricultural Financials & M-Pesa Accounting</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time cash flow ledgers in KES, P&L statements, and Safaricom M-Pesa Daraja payment gateway for {activeFarm.name}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('mpesa')}
            className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-800" />
            <span>M-Pesa Daraja Gateway</span>
          </button>
          <button
            onClick={() => setIsAddTxOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Total Season Inflow</span>
            <span className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
              {formatMoney(totalIncome)}
            </span>
            <span className="text-xs text-neutral-500 block mt-1">Milk, grain, and horticulture off-takes</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Total Season Outflow</span>
            <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
              {formatMoney(totalExpense)}
            </span>
            <span className="text-xs text-neutral-500 block mt-1">Fertilizer, seed, casual wages & fuel</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-100 text-neutral-800">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Operating Net Profit</span>
            <span className={`text-2xl font-bold font-mono tabular-nums ${netProfit >= 0 ? 'text-emerald-800' : 'text-red-700'}`}>
              {formatMoney(netProfit)}
            </span>
            <span className="text-xs text-neutral-500 block mt-1">
              Margin: {totalIncome ? Math.round((netProfit / totalIncome) * 100) : 0}% of gross revenue
            </span>
          </div>
          <div className={`p-3 rounded-xl ${netProfit >= 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl max-w-sm text-xs font-medium">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'ledger' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          General Ledger ({farmTx.length})
        </button>
        <button
          onClick={() => setActiveTab('pnl')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'pnl' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Profit & Loss Statement
        </button>
        <button
          onClick={() => setActiveTab('mpesa')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'mpesa' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          M-Pesa Simulator
        </button>
      </div>

      {/* Tab 1: General Ledger */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transaction, category, or ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filterType === 'all' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All Entries
              </button>
              <button
                onClick={() => setFilterType('Income')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filterType === 'Income' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Inflows (Income)
              </button>
              <button
                onClick={() => setFilterType('Expense')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filterType === 'Expense' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Outflows (Expenses)
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Category & Purpose</th>
                  <th className="py-3 px-4">Payee / Customer</th>
                  <th className="py-3 px-4">Payment Channel</th>
                  <th className="py-3 px-4">Reference No</th>
                  <th className="py-3 px-4 text-right">Amount ({currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-neutral-600">{tx.date}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900">{tx.category}</div>
                      <div className="text-[11px] text-neutral-500">{tx.description}</div>
                    </td>
                    <td className="py-3 px-4 text-neutral-800 font-medium">{tx.payeeOrPayer}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-100 text-neutral-800">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-800 font-semibold text-[11px]">
                      {tx.referenceNo}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-bold tabular-nums text-sm ${
                        tx.type === 'Income' ? 'text-emerald-700' : 'text-neutral-900'
                      }`}
                    >
                      {tx.type === 'Income' ? '+' : '-'} {formatMoney(tx.amountKes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Profit & Loss Statement */}
      {activeTab === 'pnl' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div>
              <h3 className="font-bold text-base text-neutral-900">Profit & Loss Statement (Year-to-Date)</h3>
              <p className="text-xs text-neutral-500">Consolidated accounting for {activeFarm.name}</p>
            </div>
            <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-neutral-100 rounded text-neutral-700">
              Currency: {currency}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Revenue Section */}
            <div>
              <div className="font-bold uppercase tracking-wider text-emerald-900 text-[11px] pb-2 border-b border-neutral-200">
                1. Agricultural Operating Revenue
              </div>
              <div className="divide-y divide-neutral-100">
                <div className="py-2.5 flex justify-between">
                  <span>Dairy Milk Sales (Bulk Offtake to Brookside & New KCC)</span>
                  <span className="font-mono font-semibold tabular-nums">{formatMoney(1155600)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Horticulture & Vegetable Consignments (Export French Beans)</span>
                  <span className="font-mono font-semibold tabular-nums">{formatMoney(2220000)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Poultry & Egg Commercial Sales</span>
                  <span className="font-mono font-semibold tabular-nums">{formatMoney(336000)}</span>
                </div>
                <div className="py-2.5 flex justify-between font-bold bg-neutral-50 px-2 rounded">
                  <span>Gross Operating Inflow</span>
                  <span className="font-mono text-emerald-800 tabular-nums">{formatMoney(totalIncome)}</span>
                </div>
              </div>
            </div>

            {/* Operating Expenses Section */}
            <div>
              <div className="font-bold uppercase tracking-wider text-neutral-800 text-[11px] pb-2 border-b border-neutral-200">
                2. Operating Expenditures & Cost of Production
              </div>
              <div className="divide-y divide-neutral-100">
                <div className="py-2.5 flex justify-between">
                  <span>Casual Labour & Plucker Wages (M-Pesa B2C)</span>
                  <span className="font-mono font-semibold tabular-nums">{formatMoney(245000)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Basal & Top-Dressing Fertilizers (DAP, CAN 50kg Bags)</span>
                  <span className="font-mono font-semibold tabular-nums">{formatMoney(420000)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Concentrated Dairy Feeds & Mineral Salt Licks</span>
                  <span className="font-mono font-semibold tabular-nums">{formatMoney(465000)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span>Machinery Fuel (Ultra-Low Sulphur Diesel)</span>
                  <span className="font-mono font-semibold tabular-nums">{formatMoney(570000)}</span>
                </div>
                <div className="py-2.5 flex justify-between font-bold bg-neutral-50 px-2 rounded">
                  <span>Total Farm Expenses</span>
                  <span className="font-mono text-neutral-900 tabular-nums">{formatMoney(totalExpense)}</span>
                </div>
              </div>
            </div>

            {/* Net Farm Earnings */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-sm font-bold text-emerald-950">
              <span>NET OPERATING SURPLUS / PROFIT</span>
              <span className="font-mono text-xl tabular-nums text-emerald-900">{formatMoney(netProfit)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: M-Pesa Daraja Payment Gateway Simulator */}
      {activeTab === 'mpesa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Safaricom Daraja API Simulator</h3>
                <p className="text-xs text-neutral-500">Live payment gateway testing for farm operations</p>
              </div>
            </div>

            <form onSubmit={handleExecuteMpesa} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Transaction Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMpesaType('B2C')}
                    className={`py-2 px-3 rounded-lg font-semibold text-center border transition-all ${
                      mpesaType === 'B2C'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-white text-neutral-700 border-neutral-300'
                    }`}
                  >
                    B2C (Disburse Casual Wages)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMpesaType('C2B')}
                    className={`py-2 px-3 rounded-lg font-semibold text-center border transition-all ${
                      mpesaType === 'C2B'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-white text-neutral-700 border-neutral-300'
                    }`}
                  >
                    C2B (Customer STK Push)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Recipient / Customer Phone Number (Safaricom) *
                </label>
                <input
                  required
                  type="text"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  placeholder="2547XXXXXXXX"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Amount (KES) *</label>
                  <input
                    required
                    type="number"
                    min="10"
                    value={mpesaAmount}
                    onChange={(e) => setMpesaAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Account Reference</label>
                  <input
                    type="text"
                    value={mpesaRef}
                    onChange={(e) => setMpesaRef(e.target.value)}
                    placeholder="e.g. MILK-SUPPLY"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Recipient Name / Worker Group</label>
                <input
                  type="text"
                  value={mpesaRecipient}
                  onChange={(e) => setMpesaRecipient(e.target.value)}
                  placeholder="e.g. 18 Casual Bean Harvesters"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessingMpesa}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {isProcessingMpesa ? (
                  <span>Calling Daraja Gateway...</span>
                ) : (
                  <>
                    <span>Execute M-Pesa {mpesaType} Transaction</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Response Payload Viewer */}
          <div className="lg:col-span-6 bg-neutral-900 text-neutral-200 p-6 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Safaricom Callback Response</span>
              <span className="text-[10px] font-mono text-neutral-400">Endpoint: /api/mpesa/simulate</span>
            </div>

            {mpesaResponse ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Transaction Reconciled & Logged to Ledger</span>
                </div>
                <pre className="p-3 bg-neutral-950 rounded-lg font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed border border-neutral-800">
                  {JSON.stringify(mpesaResponse, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-neutral-500 space-y-2">
                <Smartphone className="w-8 h-8 mx-auto text-neutral-700" />
                <p>Run a transaction to view live JSON response payload from the Daraja B2C/C2B gateway.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Manual Transaction */}
      {isAddTxOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Record Financial Ledger Entry</h3>
              <button onClick={() => setIsAddTxOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTxType('Expense')}
                  className={`py-2 text-center rounded-lg font-semibold border ${
                    txType === 'Expense' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700'
                  }`}
                >
                  Expense / Outflow
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('Income')}
                  className={`py-2 text-center rounded-lg font-semibold border ${
                    txType === 'Income' ? 'bg-emerald-800 text-white' : 'bg-white text-neutral-700'
                  }`}
                >
                  Income / Inflow
                </button>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                >
                  {txType === 'Income' ? (
                    <>
                      <option>Dairy Milk Sales</option>
                      <option>Horticulture Sales</option>
                      <option>Commercial Grain Sales</option>
                      <option>Egg Production Sales</option>
                      <option>Livestock Animal Sale</option>
                      <option>Coffee Cherry Payout</option>
                    </>
                  ) : (
                    <>
                      <option>Labor & Wages</option>
                      <option>Fertilizers & Nutrients</option>
                      <option>Certified Seeds</option>
                      <option>Animal Feeds</option>
                      <option>Crop Protection Chemicals</option>
                      <option>Fuel & Machinery Fleet</option>
                      <option>Veterinary Drugs & Care</option>
                      <option>Irrigation Maintenance</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Amount (KES) *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={amountKes}
                    onChange={(e) => setAmountKes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Transaction Date</label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Payment Channel</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="M-Pesa B2C">M-Pesa B2C</option>
                    <option value="M-Pesa Paybill">M-Pesa Paybill</option>
                    <option value="Bank EFT">Bank EFT</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Reference / Receipt No</label>
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    placeholder="QK8910..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Payee / Customer Name</label>
                <input
                  type="text"
                  value={payeeOrPayer}
                  onChange={(e) => setPayeeOrPayer(e.target.value)}
                  placeholder="e.g. Yara East Africa / Brookside"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Description / Notes</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details on invoice, bag count, etc."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddTxOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
