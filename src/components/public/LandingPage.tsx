import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Tractor,
  Sprout,
  BarChart3,
  Droplets,
  DollarSign,
  Users,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Check,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ExternalLink,
  Layers,
  Smartphone,
  Globe2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setSelectedFarmId } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [activeSectorTab, setActiveSectorTab] = useState<string>('commercial');

  const sectors = [
    {
      id: 'commercial',
      name: 'Commercial Grain & Wheat',
      desc: 'Precision acreage management for maize, wheat, barley, and canola with GPS field boundary tracking, seed rate calibration, and mechanized harvest cost accounting.',
      kpis: ['Up to 8,000+ Acres', 'Direct Combine Telemetry', 'Yield per Acre Profiling'],
      counties: 'Uasin Gishu, Trans Nzoia, Nakuru, Narok',
    },
    {
      id: 'dairy',
      name: 'Dairy & Livestock Ranches',
      desc: 'Complete herd identification, pedigree tracking, lactation performance curves, automated bulk tank chilling monitoring, and direct Brookside/New KCC collection reconciliations.',
      kpis: ['Pedigree & RFID Tracking', 'Daily Morning/Evening Litres', 'CMT & Vet Withdrawal Alerts'],
      counties: 'Nakuru, Nyandarua, Kiambu, Nandi, Meru',
    },
    {
      id: 'horticulture',
      name: 'Horticulture & Greenhouses',
      desc: 'Export-grade GlobalG.A.P. compliance, automated drip fertigation, soil moisture telemetry, cold-chain preservation, and packhouse consignment tracking for EU & UK markets.',
      kpis: ['Export Pre-Harvest Interval (PHI)', 'Hydroponic Drip Telemetry', 'KEPHIS Digital Certs'],
      counties: 'Naivasha, Machakos, Murang’a, Kajiado',
    },
    {
      id: 'cooperatives',
      name: 'Cooperatives & Estates',
      desc: 'Multi-member crop aggregation, wet mill cherry pulping batches for coffee societies, tea green leaf weighing scales integration, and bulk M-Pesa farmer dividend payments.',
      kpis: ['Multi-Farmer Aggregation', 'Produce Weighbridge Sync', 'M-Pesa Bulk Member Payouts'],
      counties: 'Nyeri, Kirinyaga, Kericho, Kisii, Bomet',
    },
  ];

  const pricingTiers = [
    {
      name: 'Starter Shamba',
      target: 'Individual smallholders and emerging family farms',
      monthlyKes: 1500,
      annualKes: 14400,
      popular: false,
      features: [
        'Up to 2 Farms & 50 Total Acres',
        'Crop & Livestock Production Records',
        'Basic M-Pesa Income & Expense Tracker',
        'Local Weather Advisories & Alerts',
        'Single User Access',
      ],
      cta: 'Start 14-Day Free Trial',
    },
    {
      name: 'Growth Commercial',
      target: 'Medium commercial farms & mixed agro-enterprises',
      monthlyKes: 5500,
      annualKes: 52800,
      popular: true,
      features: [
        'Up to 5 Farms & 500 Total Acres',
        'Complete Crop & Dairy Herd Intelligence',
        'M-Pesa Daraja Payment Gateway Simulator',
        'Full Inventory, Stores & Reorder Alerts',
        'Workforce Daily Attendance & Casual Wages',
        'Up to 8 Team Accounts & Role Permissions',
        'AGRICORE AI Agronomist Query Engine',
      ],
      cta: 'Deploy Growth Platform',
    },
    {
      name: 'Professional Enterprise',
      target: 'Large agricultural estates, exporters & cooperatives',
      monthlyKes: 18500,
      annualKes: 177600,
      popular: false,
      features: [
        'Unlimited Farms & Acreage Allocation',
        'Advanced Drip & IoT Soil Sensor Telemetry',
        'Tractor & Fleet Fuel Consumption Analytics',
        'GlobalG.A.P. & KEPHIS Document Audits',
        'Full P&L and Multi-Currency Reporting (KES/USD)',
        'Unlimited Role-Based User Access & Audit Logs',
        'Dedicated Priority Agronomic Support',
      ],
      cta: 'Get Enterprise Suite',
    },
  ];

  const faqs = [
    {
      q: 'Is AGRICORE specifically designed for Kenyan farming conditions?',
      a: 'Yes. AGRICORE is built natively with the Kenyan agricultural ecosystem in mind: default Kenyan Shilling (KES) currency, Kenyan counties and sub-counties, acreage/hectare conversions, M-Pesa Daraja integration architecture, certified seed varieties from Kenya Seed Company, and agro-ecological calendar tracking tailored to Kenyan Long and Short rains.',
    },
    {
      q: 'Can I manage multiple separate farms and estates under one account?',
      a: 'Absolutely. AGRICORE features a multi-tenant enterprise architecture. You can register distinct farms (e.g. a dairy farm in Nakuru, a commercial maize estate in Eldoret, and a greenhouse in Naivasha) and seamlessly switch between them while maintaining centralized financial consolidation.',
    },
    {
      q: 'How does the M-Pesa integration work for payroll and produce sales?',
      a: 'AGRICORE provides an integrated Safaricom Daraja API architecture. You can disburse casual labour wages directly via B2C M-Pesa batches and accept customer produce payments via STK Push C2B or Paybill, complete with transaction reference reconciliations.',
    },
    {
      q: 'Does AGRICORE function for both crop farming and dairy/livestock?',
      a: 'Yes. Our platform includes dedicated, specialized modules for both. You get full crop cycle tracking (planting to harvest, scouting, fertilizer schedules) alongside livestock tracking (daily morning/evening milk yields, somatic cell counts, vet records, and egg collection logs).',
    },
    {
      q: 'What is AGRICORE AI and how does it assist our farm operations?',
      a: 'AGRICORE AI is an intelligent agricultural advisor powered by Google Gemini. It analyzes your farm records, soil parameters, and crop data to provide immediate agronomic recommendations, fertilizer application rates, pest and disease identification, and feed ration optimization tailored to Kenyan agro-climatic zones.',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Single element wordmark / brand mark */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/public/assets/aistudio/file_0000000025f082118f54b8ef8912b627_70036e6d.png"
              alt="AGRICORE Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <a href="#solutions" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              Sectors
            </a>
            <a href="#capabilities" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              Platform Modules
            </a>
            <a href="#pricing" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              Pricing Plans
            </a>
            <a href="#testimonials" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              Case Studies
            </a>
            <a href="#faq" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
              FAQ
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <span>Launch FMIS Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50/70">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Quiet kicker metadata with typographic separator */}
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wider uppercase">
                <span>Enterprise FMIS for East Africa</span>
                <span aria-hidden="true">·</span>
                <span>47 Kenyan Counties</span>
                <span aria-hidden="true">·</span>
                <span>Native KES & M-Pesa</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-tight" style={{ textWrap: 'balance' }}>
                Smart Agriculture. <br />
                Smarter Decisions. <br />
                <span className="text-emerald-800">Better Harvests.</span>
              </h1>

              <p className="text-lg text-neutral-600 max-w-2xl leading-relaxed">
                The all-in-one digital operating system built for Kenyan commercial farms, cooperatives, livestock ranches, and horticultural estates. Unite field operations, dairy production, inventory, KES financial ledgers, and AI agronomy intelligence in one unified platform.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setSelectedFarmId('farm-001');
                    setCurrentView('dashboard');
                  }}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Enter Enterprise Demo Shamba</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setSelectedFarmId('farm-003');
                    setCurrentView('dashboard');
                  }}
                  className="px-6 py-3.5 text-sm font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-all whitespace-nowrap"
                >
                  Explore Naivasha Greenhouses
                </button>
              </div>

              {/* Trust proof bar */}
              <div className="pt-8 border-t border-neutral-200/80 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="text-2xl font-bold font-mono text-emerald-900 tabular-nums">54,000+</div>
                  <div className="text-xs text-neutral-500 font-medium">Acres Managed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-emerald-900 tabular-nums">1.4M L</div>
                  <div className="text-xs text-neutral-500 font-medium">Monthly Milk Logged</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-amber-700 tabular-nums">KES 480M</div>
                  <div className="text-xs text-neutral-500 font-medium">Transactions Tracked</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: Live Interactive System Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Tractor className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-neutral-900">Rift Valley Highland Estate</div>
                      <div className="text-xs text-neutral-500">Nakuru County · 450 Acres</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                    Active Shamba
                  </span>
                </div>

                {/* Live mini stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
                    <span className="text-xs text-neutral-500 block mb-1">Commercial Maize Yield</span>
                    <span className="text-lg font-bold font-mono text-neutral-900 tabular-nums">4,906 Bags</span>
                    <span className="text-xs text-emerald-600 block mt-0.5">+4.2% vs target</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
                    <span className="text-xs text-neutral-500 block mb-1">Dairy Milk Today</span>
                    <span className="text-lg font-bold font-mono text-neutral-900 tabular-nums">1,530 Litres</span>
                    <span className="text-xs text-neutral-500 block mt-0.5">3.88% Butterfat</span>
                  </div>
                </div>

                {/* Weather Snippet */}
                <div className="p-3.5 rounded-xl bg-emerald-900 text-white flex items-center justify-between">
                  <div>
                    <div className="text-xs text-emerald-200 font-medium">Rongai Microclimate Weather</div>
                    <div className="text-xl font-bold font-mono">22°C · Partly Cloudy</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-emerald-200">Soil Moisture</div>
                    <div className="text-sm font-mono font-bold">42% VWC (Optimal)</div>
                  </div>
                </div>

                {/* Interactive action inside preview */}
                <button
                  onClick={() => {
                    setSelectedFarmId('farm-001');
                    setCurrentView('crops');
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-center text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Open Crop Planting & Scouting Dashboard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agricultural Sector Solutions */}
      <section id="solutions" className="py-20 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">Agricultural Sectors</div>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Tailored for Kenya’s Key Agricultural Value Chains</h2>
            <p className="text-neutral-600 mt-3 text-base">
              Whether you cultivate commercial maize in the North Rift, export French beans from Naivasha, manage dairy herds in Kiambu, or operate tea factories in Kericho, AGRICORE adapts to your operation.
            </p>
          </div>

          {/* Interactive Sector Switcher */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 bg-neutral-100 rounded-xl mb-8">
            {sectors.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSectorTab(sec.id)}
                className={`px-4 py-3 text-xs font-semibold rounded-lg transition-all text-center whitespace-nowrap ${
                  activeSectorTab === sec.id
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {sec.name}
              </button>
            ))}
          </div>

          {/* Selected Sector Details */}
          {(() => {
            const currentSec = sectors.find((s) => s.id === activeSectorTab) || sectors[0];
            return (
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4">
                  <h3 className="text-2xl font-bold text-neutral-900">{currentSec.name}</h3>
                  <p className="text-neutral-600 leading-relaxed text-sm md:text-base">{currentSec.desc}</p>
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Target Agro-Zones: <span className="text-emerald-800 font-bold">{currentSec.counties}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {currentSec.kpis.map((kpi, idx) => (
                      <span key={idx} className="text-xs font-medium bg-white px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-800">
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-5 bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Direct Module Action</div>
                  <div className="text-sm font-semibold text-neutral-900">Experience this sector in the live demo:</div>
                  <button
                    onClick={() => {
                      if (activeSectorTab === 'dairy') {
                        setSelectedFarmId('farm-001');
                        setCurrentView('livestock');
                      } else if (activeSectorTab === 'horticulture') {
                        setSelectedFarmId('farm-003');
                        setCurrentView('irrigation');
                      } else {
                        setSelectedFarmId('farm-002');
                        setCurrentView('crops');
                      }
                    }}
                    className="w-full py-3 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Launch {currentSec.name} Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Core Platform Capabilities (12 Enterprise Modules) */}
      <section id="capabilities" className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">Integrated Architecture</div>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">12 Interconnected Modules Built for Complete Control</h2>
            <p className="text-neutral-600 mt-2 text-base">
              From seed selection to supermarket shelf, every transaction, planting cycle, vet injection, and fuel drop connects dynamically to your bottom line.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: 'Multi-Farm & Block Zoning',
                view: 'farms',
                desc: 'Register multiple shamba locations across counties, assign GPS coordinates, map field blocks, and evaluate soil pH and tenure.',
              },
              {
                icon: Sprout,
                title: 'Crop Cycle Production',
                view: 'crops',
                desc: 'Manage maize, beans, coffee, tea, and horticulture with planting schedules, scouting logs, fertilizer calculators, and yield per acre.',
              },
              {
                icon: Tractor,
                title: 'Livestock & Dairy Records',
                view: 'livestock',
                desc: 'Individual RFID ear tags, pedigree lineage, daily morning/evening milk collection, butterfat tracking, and vet withdrawal alerts.',
              },
              {
                icon: DollarSign,
                title: 'KES Financials & M-Pesa',
                view: 'finance',
                desc: 'Real-time profit & loss, cash flow, budget vs actual variances, and native M-Pesa Daraja payment gateway for wages and sales.',
              },
              {
                icon: Layers,
                title: 'Store & Inventory Management',
                view: 'inventory',
                desc: 'Track seed bags, fertilizers, agrochemicals, and harvested grain in real time with batch numbers, expiry warnings, and reorder levels.',
              },
              {
                icon: Users,
                title: 'Workforce & Casual Wages',
                view: 'workforce',
                desc: 'Manage permanent employees and casual piece-rate pickers with automated piece-rate calculators and M-Pesa bulk disbursements.',
              },
              {
                icon: Droplets,
                title: 'Irrigation & Water Telemetry',
                view: 'irrigation',
                desc: 'Monitor solar boreholes, earth dams, drip lines, and live soil moisture sensors (% VWC) with automated irrigation advisories.',
              },
              {
                icon: Sparkles,
                title: 'AGRICORE AI Agronomist',
                view: 'ai-advisor',
                desc: 'Gemini-powered agricultural intelligence providing instant answers on fertilizer dosages, Fall Armyworm control, and dairy feed rations.',
              },
              {
                icon: ShieldCheck,
                title: 'Compliance & Document Vault',
                view: 'documents',
                desc: 'Store land title deeds, KEPHIS export certs, GlobalG.A.P. audits, and NEMA water extraction permits with expiry alerts.',
              },
            ].map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setCurrentView(mod.view as any)}
                  className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-semibold text-neutral-900 group-hover:text-emerald-900 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-neutral-600 text-xs mt-2 leading-relaxed">{mod.desc}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Plans in KES */}
      <section id="pricing" className="py-20 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">Transparent Subscriptions</div>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Flexible Investment for Every Scale of Farming</h2>
            <p className="text-neutral-600 mt-2 text-sm md:text-base">
              All plans include complete Kenya localization, KES accounting, M-Pesa payment gateway readiness, and regular agro-climatic intelligence updates.
            </p>

            {/* Billing Cadence Toggle */}
            <div className="inline-flex items-center gap-1 p-1 bg-neutral-100 rounded-lg mt-6">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  billingCycle === 'monthly' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  billingCycle === 'annual' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Annual Billing (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingTiers.map((tier, idx) => {
              const price = billingCycle === 'monthly' ? tier.monthlyKes : Math.round(tier.annualKes / 12);
              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-8 flex flex-col justify-between transition-all ${
                    tier.popular
                      ? 'bg-neutral-900 text-white shadow-xl ring-2 ring-emerald-600 relative'
                      : 'bg-neutral-50 text-neutral-900 border border-neutral-200'
                  }`}
                >
                  <div>
                    {tier.popular && (
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                        Most Popular for Commercial Farms
                      </div>
                    )}
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <p className={`text-xs mt-1 ${tier.popular ? 'text-neutral-400' : 'text-neutral-500'}`}>{tier.target}</p>

                    <div className="mt-6 mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl md:text-4xl font-bold font-mono tabular-nums">
                          KES {price.toLocaleString()}
                        </span>
                        <span className={`text-xs ${tier.popular ? 'text-neutral-400' : 'text-neutral-500'}`}>/month</span>
                      </div>
                      {billingCycle === 'annual' && (
                        <div className="text-xs text-emerald-400 mt-1">Billed annually (KES {tier.annualKes.toLocaleString()})</div>
                      )}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-neutral-200/20 text-xs">
                      {tier.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5">
                          <Check className={`w-4 h-4 shrink-0 ${tier.popular ? 'text-emerald-400' : 'text-emerald-700'}`} />
                          <span className={tier.popular ? 'text-neutral-200' : 'text-neutral-700'}>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className={`w-full py-3 text-xs font-semibold rounded-lg transition-all ${
                        tier.popular
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                          : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                      }`}
                    >
                      {tier.cta}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demonstration Case Studies & Testimonials */}
      <section id="testimonials" className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">Verified Farm Proof</div>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Proven Outcomes Across East African Agriculture</h2>
            <p className="text-neutral-600 mt-2 text-sm">
              Demonstration results from progressive Kenyan commercial managers who transformed their operations using AGRICORE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  'Managing 450 acres of hybrid seed maize and French beans used to require 6 disparate ledger books. With AGRICORE, our scouting logs and casual plucker payroll via M-Pesa are reconciled in minutes, cutting our post-harvest accounting lag by 80%.',
                author: 'Eng. Kiprono Koech',
                role: 'General Farm Manager',
                farm: 'Rift Valley Highland Estate (Nakuru)',
                gain: '+14% Net Profitability in Season 1',
              },
              {
                quote:
                  'In our 120-head dairy unit, tracking milk somatic cell counts and antibiotic withdrawal days was critical for our Brookside supply agreement. AGRICORE prevents tank contamination and improved our average milk yield to 31.4 litres per cow.',
                author: 'Dr. Joseph Karanja',
                role: 'Resident Veterinary Surgeon',
                farm: 'Central Kenya Dairy & Agro Ranches',
                gain: 'Zero Milk Offtake Rejections',
              },
              {
                quote:
                  'Exporting snow peas and fine beans to European retailers requires meticulous spray records and GlobalG.A.P. document verification. AGRICORE’s document vault and chemical PHI timers keep us 100% audit-ready at all times.',
                author: 'Daniel Muthomi Kariuki',
                role: 'Horticulture Operations Director',
                farm: 'Naivasha Lakeside Greenhouses',
                gain: '100% GlobalG.A.P Audit Compliance',
              },
            ].map((test, idx) => (
              <div key={idx} className="bg-white p-7 rounded-2xl border border-neutral-200 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold font-mono text-emerald-800 mb-4">{test.gain}</div>
                  <p className="text-neutral-700 text-sm leading-relaxed italic">"{test.quote}"</p>
                </div>
                <div className="pt-6 mt-6 border-t border-neutral-100">
                  <div className="font-semibold text-sm text-neutral-900">{test.author}</div>
                  <div className="text-xs text-neutral-500">{test.role}</div>
                  <div className="text-xs text-emerald-800 font-medium mt-0.5">{test.farm}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-20 bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">Frequently Asked Questions</div>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Everything You Need to Know About AGRICORE</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-neutral-200 rounded-xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-neutral-900">{faq.q}</span>
                  <span className="text-neutral-400 font-mono text-base">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 py-4 text-xs md:text-sm text-neutral-600 bg-white border-t border-neutral-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Agronomy Briefing Request */}
      <section id="contact" className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase">Enterprise Inquiries</div>
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
                Schedule a Consultation with an AGRICORE Agricultural Specialist
              </h2>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Whether you manage a 50-acre mixed holding or an agricultural cooperative with 10,000 members, our Nairobi and Nakuru implementation teams provide on-site calibration, staff training, and data migration.
              </p>

              <div className="space-y-3 text-xs text-neutral-600 pt-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-emerald-800" />
                  <span>Nairobi Regional Office: Upper Hill, Commercial Tower 6th Floor</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-800" />
                  <span>Direct Farm Desk: +254 (0) 700 890 000 / +254 (0) 722 000 000</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-800" />
                  <span>support@agricore.co.ke · inquiries@agricore.africa</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
                {contactSubmitted ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900">Inquiry Received</h3>
                    <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                      Our agricultural solutions engineer will contact you within 2 hours to configure your customized enterprise trial shamba.
                    </p>
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className="mt-4 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900"
                    >
                      Proceed to Live System Now
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <h3 className="text-base font-semibold text-neutral-900">Request Enterprise Farm Demonstration</h3>
                    <div>
                      <label className="text-xs font-medium text-neutral-700 block mb-1">Your Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. David Mwangi"
                        className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-neutral-700 block mb-1">Phone Number (M-Pesa)</label>
                        <input
                          required
                          type="tel"
                          placeholder="+254 7XX XXX XXX"
                          className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-neutral-700 block mb-1">Farm County Location</label>
                        <select className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700">
                          <option>Nakuru</option>
                          <option>Uasin Gishu</option>
                          <option>Kiambu</option>
                          <option>Trans Nzoia</option>
                          <option>Machakos</option>
                          <option>Meru</option>
                          <option>Kericho</option>
                          <option>Other Kenyan County</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-700 block mb-1">Estimated Farm Acreage & Operations</label>
                      <input
                        type="text"
                        placeholder="e.g. 150 Acres, Commercial Maize & 40 Dairy Cows"
                        className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-all"
                    >
                      Submit & Access Live Demonstration
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-white text-base font-bold font-display tracking-wider">AGRICORE</span>
            </div>
            <p className="text-neutral-500 leading-relaxed">
              Smart Agriculture. Smarter Decisions. Better Harvests. <br />
              Enterprise Farm Management Information System for Kenya & East Africa.
            </p>
          </div>

          <div>
            <div className="font-semibold text-white mb-3">Agricultural Modules</div>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentView('crops')} className="hover:text-white">Crop Production Tracking</button></li>
              <li><button onClick={() => setCurrentView('livestock')} className="hover:text-white">Livestock & Dairy Records</button></li>
              <li><button onClick={() => setCurrentView('finance')} className="hover:text-white">KES Financials & M-Pesa</button></li>
              <li><button onClick={() => setCurrentView('inventory')} className="hover:text-white">Agro-Input Stores</button></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-white mb-3">Enterprise Solutions</div>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentView('irrigation')} className="hover:text-white">Water & Drip Telemetry</button></li>
              <li><button onClick={() => setCurrentView('ai-advisor')} className="hover:text-white">AGRICORE AI Agronomist</button></li>
              <li><button onClick={() => setCurrentView('workforce')} className="hover:text-white">M-Pesa Casual Wages</button></li>
              <li><button onClick={() => setCurrentView('superadmin')} className="hover:text-white">Super Administrator Console</button></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-white mb-3">Regional Support</div>
            <p className="text-neutral-500 mb-2">Designed for Kenya, Uganda, Tanzania, and Rwanda agricultural zones.</p>
            <div className="font-mono text-emerald-400">Version 2.4-Enterprise</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-neutral-800 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} AGRICORE Enterprise FMIS. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-white">System Portal</button>
            <button onClick={() => setCurrentView('superadmin')} className="hover:text-white">Admin Console</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
