import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Employee } from '../../types/index.ts';
import {
  Users,
  Plus,
  Search,
  Smartphone,
  CheckCircle,
  X,
  Calendar,
  Briefcase,
  Phone,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export const WorkforceModule: React.FC = () => {
  const { activeFarm, employees, addEmployee, updateEmployee, simulateMpesa, formatMoney } = useApp();
  const farmEmployees = employees.filter((e) => e.farmId === activeFarm.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isPayingPayroll, setIsPayingPayroll] = useState(false);
  const [payrollSuccessMessage, setPayrollSuccessMessage] = useState<string | null>(null);

  // New Employee form state
  const [employeeNo, setEmployeeNo] = useState('');
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [department, setDepartment] = useState<Employee['department']>('Agronomy & Crops');
  const [role, setRole] = useState('Field Supervisor');
  const [employmentType, setEmploymentType] = useState<Employee['employmentType']>('Permanent');
  const [dailyWageKes, setDailyWageKes] = useState<number>(2500);

  const filteredEmployees = farmEmployees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone.includes(searchQuery);
    const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const totalDailyWageBill = farmEmployees.reduce((acc, emp) => acc + emp.dailyWageKes, 0);

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !nationalId) return;

    addEmployee({
      farmId: activeFarm.id,
      employeeNo: employeeNo || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      fullName,
      nationalId,
      phone,
      department,
      role,
      employmentType,
      dailyWageKes: Number(dailyWageKes),
      status: 'Active',
      mpesaRegistered: true,
    });

    setIsAddEmployeeOpen(false);
    setFullName('');
    setNationalId('');
    setRole('');
  };

  const handleDisburseBulkPayroll = async () => {
    setIsPayingPayroll(true);
    setPayrollSuccessMessage(null);

    const totalAmount = totalDailyWageBill * 7; // Weekly wage batch
    const samplePhone = '254722890142';
    const result = await simulateMpesa(
      'B2C',
      totalAmount,
      samplePhone,
      `WAGES-WK-${Date.now().toString().slice(-4)}`,
      `Batch of ${farmEmployees.length} Workers`
    );

    setIsPayingPayroll(false);
    setPayrollSuccessMessage(
      `Safaricom Daraja B2C Bulk Disbursement confirmed! KES ${totalAmount.toLocaleString()} disbursed to ${farmEmployees.length} active workers (Ref: ${result.TransactionID}).`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Workforce Management & Casual Wages</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Permanent staff, tractor operators, casual pluckers, daily wage calculators, and M-Pesa bulk payouts for {activeFarm.name}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPayrollModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-800" />
            <span>Disburse M-Pesa Payroll</span>
          </button>
          <button
            onClick={() => setIsAddEmployeeOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Farm Worker</span>
          </button>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Registered Staff</span>
          <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            {farmEmployees.length} Workers
          </span>
          <span className="text-xs text-neutral-500 block mt-1">100% Safaricom M-Pesa Verified</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Daily Wage Liability</span>
          <span className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
            {formatMoney(totalDailyWageBill)}
          </span>
          <span className="text-xs text-neutral-500 block mt-1">Across all field & dairy departments</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Casual Plucker Roster</span>
          <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            48 Harvesters
          </span>
          <span className="text-xs text-neutral-500 block mt-1">Piece-rate KES 15 per kg picked</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search worker name, ID, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-neutral-100 rounded-lg text-xs">
          {['all', 'Agronomy & Crops', 'Dairy & Livestock', 'Mechanization & Fleet', 'Finance & Admin'].map((d) => (
            <button
              key={d}
              onClick={() => setDepartmentFilter(d)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                departmentFilter === d ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {d === 'all' ? 'All Departments' : d.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Employee List Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Employee Details</th>
              <th className="py-3 px-4">Department & Role</th>
              <th className="py-3 px-4">National ID</th>
              <th className="py-3 px-4">Contact Phone (M-Pesa)</th>
              <th className="py-3 px-4">Contract Type</th>
              <th className="py-3 px-4">Daily Wage Rate</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-neutral-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-neutral-900">{emp.fullName}</div>
                  <div className="text-[10px] font-mono text-neutral-400">{emp.employeeNo}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-neutral-800">{emp.role}</div>
                  <div className="text-[11px] text-neutral-500">{emp.department}</div>
                </td>
                <td className="py-3 px-4 font-mono tabular-nums text-neutral-700">{emp.nationalId}</td>
                <td className="py-3 px-4 font-mono text-emerald-800 font-medium">{emp.phone}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-800">
                    {emp.employmentType}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-neutral-900 tabular-nums">
                  {formatMoney(emp.dailyWageKes)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800">
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Bulk M-Pesa Payroll Disburser */}
      {isPayrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Bulk M-Pesa Payroll Disbursement</h3>
              <button onClick={() => setIsPayrollModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4 text-xs">
              <p className="text-neutral-600 leading-relaxed">
                You are preparing to disburse weekly wages to <strong>{farmEmployees.length} registered employees and operators</strong> on {activeFarm.name} via the Safaricom Daraja B2C Bulk Wages Gateway.
              </p>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Workforce Count:</span>
                  <strong className="font-mono">{farmEmployees.length} Staff</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Daily Total Wage:</span>
                  <span className="font-mono font-semibold">{formatMoney(totalDailyWageBill)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-emerald-200 text-emerald-950">
                  <span>7-Day Weekly Gross Wage Bill:</span>
                  <span className="font-mono text-base">{formatMoney(totalDailyWageBill * 7)}</span>
                </div>
              </div>

              {payrollSuccessMessage && (
                <div className="p-3 bg-neutral-900 text-emerald-400 rounded-lg text-xs font-mono space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>Transaction Confirmed</span>
                  </div>
                  <div>{payrollSuccessMessage}</div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsPayrollModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isPayingPayroll}
                  onClick={handleDisburseBulkPayroll}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs flex items-center gap-2"
                >
                  {isPayingPayroll ? <span>Disbursing via Daraja...</span> : <span>Confirm & Send Bulk M-Pesa</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Farm Worker */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Register Farm Employee</h3>
              <button onClick={() => setIsAddEmployeeOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Full Legal Name *</label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. David Kipchoge"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">National ID Number *</label>
                  <input
                    required
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="e.g. 29104821"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Safaricom Phone Number *</label>
                  <input
                    required
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Employee Number</label>
                  <input
                    type="text"
                    value={employeeNo}
                    onChange={(e) => setEmployeeNo(e.target.value)}
                    placeholder="e.g. EMP-007"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Agronomy & Crops">Agronomy & Crops</option>
                    <option value="Dairy & Livestock">Dairy & Livestock</option>
                    <option value="Mechanization & Fleet">Mechanization & Fleet</option>
                    <option value="Finance & Admin">Finance & Admin</option>
                    <option value="Irrigation & Maintenance">Irrigation & Maintenance</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Job Designation</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Tractor Driver / Milk Collector"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Contract Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                    <option value="Casual Piece-Rate">Casual Piece-Rate</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Daily Wage (KES) *</label>
                  <input
                    required
                    type="number"
                    min="100"
                    value={dailyWageKes}
                    onChange={(e) => setDailyWageKes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Register Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
