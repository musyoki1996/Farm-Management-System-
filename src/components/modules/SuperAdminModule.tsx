import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ShieldAlert,
  Building2,
  Users,
  CreditCard,
  Activity,
  CheckCircle,
  AlertTriangle,
  Server,
  Key,
  Smartphone,
  Sparkles,
  CloudSun,
} from 'lucide-react';

export const SuperAdminModule: React.FC = () => {
  const { farms, showNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'health' | 'integrations'>('overview');

  const tenantOrganizations = [
    {
      id: 'org-01',
      name: 'Rift Valley Agro-Enterprise Holdings Ltd',
      plan: 'Professional Enterprise',
      farmsCount: 4,
      totalAcres: 1555,
      usersCount: 14,
      mrrKes: 18500,
      status: 'Active',
      renewalDate: '2027-03-15',
    },
    {
      id: 'org-02',
      name: 'Central Highlands Coffee Cooperative Union',
      plan: 'Professional Enterprise',
      farmsCount: 12,
      totalAcres: 4800,
      usersCount: 38,
      mrrKes: 38000,
      status: 'Active',
      renewalDate: '2027-01-20',
    },
    {
      id: 'org-03',
      name: 'Moiben Grain & Dairy Commercial Shamba',
      plan: 'Growth Commercial',
      farmsCount: 2,
      totalAcres: 650,
      usersCount: 6,
      mrrKes: 5500,
      status: 'Active',
      renewalDate: '2026-12-10',
    },
    {
      id: 'org-04',
      name: 'Naivasha Flower Exporters Consortium',
      plan: 'Professional Enterprise',
      farmsCount: 5,
      totalAcres: 420,
      usersCount: 22,
      mrrKes: 24500,
      status: 'Active',
      renewalDate: '2027-04-05',
    },
  ];

  const systemHealth = [
    {
      component: 'Core PostgreSQL Database Engine',
      status: 'Operational',
      latency: '2.4 ms',
      details: 'Relational ACID schema, tenant isolation active, automated hourly snapshots.',
      icon: Server,
    },
    {
      component: 'Google Gemini 3.8 Flash AI Model',
      status: 'Connected',
      latency: '420 ms',
      details: 'Direct server-side SDK @google/genai initialized via process.env.GEMINI_API_KEY.',
      icon: Sparkles,
    },
    {
      component: 'Safaricom Daraja M-Pesa Gateway',
      status: 'Active / Sandbox Verified',
      latency: '85 ms',
      details: 'B2C bulk wages and C2B STK Push endpoints responding with HTTP 200.',
      icon: Smartphone,
    },
    {
      component: 'Kenya Meteorological Regional Service',
      status: 'Operational',
      latency: '140 ms',
      details: '47 Kenyan county microclimate forecasts and soil moisture sensor proxies synced.',
      icon: CloudSun,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Super Administrator Control Console</h2>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded">
              Platform Root
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Multi-tenant organization oversight, subscription billing metrics, system telemetry, and third-party API configurations.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl max-w-md text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'overview' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Overview & MRR
        </button>
        <button
          onClick={() => setActiveTab('tenants')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'tenants' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Tenant Organizations ({tenantOrganizations.length})
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'health' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          System Health
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'integrations' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          API Gateways
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Monthly Recurring (MRR)</span>
              <span className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
                KES 86,500
              </span>
              <span className="text-xs text-neutral-500 block mt-1">+18.5% Net MRR Growth</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Total Tenant Orgs</span>
              <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                4 Enterprises
              </span>
              <span className="text-xs text-neutral-500 block mt-1">23 Individual Shambas</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Acreage Under Mgmt</span>
              <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                7,425 Acres
              </span>
              <span className="text-xs text-neutral-500 block mt-1">Across 7 Kenyan Counties</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Active User Licenses</span>
              <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                80 Accounts
              </span>
              <span className="text-xs text-emerald-700 block mt-1">Role-Based Access Control</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tenant Organizations */}
      {activeTab === 'tenants' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Organization Name</th>
                <th className="py-3 px-4">Subscription Plan</th>
                <th className="py-3 px-4">Farms Registered</th>
                <th className="py-3 px-4">Cultivated Area</th>
                <th className="py-3 px-4">Monthly Bill</th>
                <th className="py-3 px-4">Next Renewal</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {tenantOrganizations.map((org) => (
                <tr key={org.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-neutral-900">{org.name}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {org.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-neutral-800 tabular-nums">
                    {org.farmsCount} Shambas
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-neutral-700">
                    {org.totalAcres.toLocaleString()} Acres
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-neutral-900 tabular-nums">
                    KES {org.mrrKes.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-500">{org.renewalDate}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                      {org.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: System Health */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemHealth.map((sys, idx) => {
              const Icon = sys.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between pb-2 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-neutral-900">{sys.component}</h4>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {sys.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{sys.details}</p>
                  <div className="pt-2 border-t border-neutral-100 flex justify-between text-xs font-mono text-neutral-400">
                    <span>Response Latency:</span>
                    <strong className="text-neutral-800">{sys.latency}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: API Gateways */}
      {activeTab === 'integrations' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-neutral-900">Third-Party Gateway Connectivity</h3>
            <p className="text-xs text-neutral-500">
              Production integrations securely injected via runtime environment variables.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">Safaricom Daraja B2C / C2B Payment Gateway</span>
                <span className="font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Configured & Tested</span>
              </div>
              <p className="text-neutral-600">
                Consumer Key, Consumer Secret, and Shortcode B2C 600000 active for casual wages and produce collection.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">Google Gemini API (@google/genai SDK)</span>
                <span className="font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Active (gemini-3.8-flash)</span>
              </div>
              <p className="text-neutral-600">
                Server-side proxy endpoint initialized at /api/gemini/advisor with agronomy system instructions.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">Kenya Meteorological Agro-Advisory Weather Service</span>
                <span className="font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Operational</span>
              </div>
              <p className="text-neutral-600">
                Serving real-time temperature, rainfall 7-day totals, and VWC soil moisture metrics for Nakuru, Eldoret, Kiambu, Machakos, Meru.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
