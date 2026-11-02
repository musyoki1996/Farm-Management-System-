import React from 'react';
import { useApp, AppView } from '../../context/AppContext.tsx';
import {
  LayoutDashboard,
  MapPin,
  CheckSquare,
  Sprout,
  Tractor,
  Droplets,
  DollarSign,
  Boxes,
  ShoppingBag,
  Truck,
  Users,
  Wrench,
  FileText,
  Sparkles,
  BarChart3,
  ShieldAlert,
  Globe,
  ChevronDown,
  Building2,
} from 'lucide-react';

export const AppSidebar: React.FC<{ isOpen: boolean; onCloseMobile?: () => void }> = ({
  isOpen,
  onCloseMobile,
}) => {
  const {
    currentView,
    setCurrentView,
    farms,
    selectedFarmId,
    setSelectedFarmId,
    activeFarm,
    currentRole,
  } = useApp();

  const navSections = [
    {
      group: 'Core Management',
      items: [
        { id: 'dashboard' as AppView, label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'farms' as AppView, label: 'Farms & Field Blocks', icon: MapPin },
        { id: 'tasks' as AppView, label: 'Operations & Tasks', icon: CheckSquare },
      ],
    },
    {
      group: 'Agricultural Production',
      items: [
        { id: 'crops' as AppView, label: 'Crop Production', icon: Sprout },
        { id: 'livestock' as AppView, label: 'Livestock & Dairy', icon: Tractor },
        { id: 'irrigation' as AppView, label: 'Irrigation & Water', icon: Droplets },
      ],
    },
    {
      group: 'Commercial & Supplies',
      items: [
        { id: 'finance' as AppView, label: 'Financials & M-Pesa', icon: DollarSign },
        { id: 'inventory' as AppView, label: 'Store & Inventory', icon: Boxes },
        { id: 'sales' as AppView, label: 'Produce Sales & Orders', icon: ShoppingBag },
        { id: 'procurement' as AppView, label: 'Suppliers & POs', icon: Truck },
      ],
    },
    {
      group: 'Assets & Workforce',
      items: [
        { id: 'workforce' as AppView, label: 'Workforce & Wages', icon: Users },
        { id: 'equipment' as AppView, label: 'Machinery & Fleet', icon: Wrench },
        { id: 'documents' as AppView, label: 'Documents & Compliance', icon: FileText },
      ],
    },
    {
      group: 'Intelligence & Admin',
      items: [
        { id: 'ai-advisor' as AppView, label: 'AGRICORE AI Agronomist', icon: Sparkles, badge: 'AI' },
        { id: 'reports' as AppView, label: 'Reports & BI Analytics', icon: BarChart3 },
        { id: 'superadmin' as AppView, label: 'Super Admin Console', icon: ShieldAlert },
      ],
    },
  ];

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-neutral-900 text-neutral-300 flex flex-col border-r border-neutral-800 transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/public/assets/aistudio/file_0000000025f082118f54b8ef8912b627_70036e6d.png"
            alt="AGRICORE"
            className="h-9 w-auto object-contain bg-white/5 p-1 rounded"
          />
          <div>
            <div className="text-white font-bold text-sm tracking-wider font-display">AGRICORE</div>
            <div className="text-[10px] text-emerald-400 font-mono tracking-tight uppercase">Enterprise FMIS</div>
          </div>
        </div>
      </div>

      {/* Active Farm Switcher */}
      <div className="p-4 border-b border-neutral-800/80 bg-neutral-950/40">
        <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
          <Building2 className="w-3 h-3 text-emerald-400" />
          <span>Active Farm Location</span>
        </label>
        <div className="relative">
          <select
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="w-full text-xs font-medium text-white bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 pr-7 appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id} className="bg-neutral-800 text-white">
                {f.name} ({f.county} - {f.totalAcres} Ac)
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 px-1">
          <span>{activeFarm?.county} County</span>
          <span className="font-mono text-emerald-400">{activeFarm?.totalAcres} Acres</span>
        </div>
      </div>

      {/* Navigation Links Scrollable */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-1.5">
              {section.group}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-800 text-white font-semibold shadow-sm'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold bg-amber-500 text-neutral-950 px-1.5 py-0.2 rounded">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Role Indicator & Switch to Website */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950/60 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-white truncate max-w-[150px]">{currentRole}</div>
            <div className="text-[10px] text-neutral-400">Kenya Commercial Org</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>

        <button
          onClick={() => setCurrentView('website')}
          className="w-full py-2 text-[11px] font-medium text-neutral-300 bg-neutral-800/80 hover:bg-neutral-800 hover:text-white rounded-md transition-colors flex items-center justify-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Exit to Public Website</span>
        </button>
      </div>
    </aside>
  );
};
