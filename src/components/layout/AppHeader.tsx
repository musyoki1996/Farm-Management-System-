import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { UserRole } from '../../types/index.ts';
import {
  Menu,
  Sun,
  CloudRain,
  RefreshCw,
  Plus,
  Coins,
  Shield,
  X,
  Sprout,
  Milk,
  DollarSign,
  CheckSquare,
} from 'lucide-react';

export const AppHeader: React.FC<{ onToggleMobileSidebar: () => void }> = ({
  onToggleMobileSidebar,
}) => {
  const {
    currentView,
    activeFarm,
    weatherData,
    refreshWeather,
    currency,
    setCurrency,
    currentRole,
    setCurrentRole,
    setCurrentView,
  } = useApp();

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isRefreshingWeather, setIsRefreshingWeather] = useState(false);

  const rolesList: UserRole[] = [
    'Super Administrator',
    'Farm Owner',
    'Farm Manager',
    'Accountant',
    'Agronomist',
    'Veterinary Officer',
    'Inventory Manager',
    'Procurement Officer',
    'Field Supervisor',
    'Farm Worker',
  ];

  const handleRefreshWeather = async () => {
    setIsRefreshingWeather(true);
    await refreshWeather();
    setTimeout(() => setIsRefreshingWeather(false), 600);
  };

  const getBreadcrumbTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Executive Overview';
      case 'farms':
        return 'Farms & Land Blocks';
      case 'crops':
        return 'Crop Cycles & Scouting';
      case 'livestock':
        return 'Herd & Dairy Production';
      case 'finance':
        return 'Financial Ledgers & M-Pesa';
      case 'inventory':
        return 'Stores & Input Inventory';
      case 'workforce':
        return 'Workforce & Labour Wages';
      case 'equipment':
        return 'Machinery & Fleet Management';
      case 'sales':
        return 'Produce Orders & Commodity Markets';
      case 'procurement':
        return 'Suppliers & Purchase Orders';
      case 'irrigation':
        return 'Irrigation & Water Telemetry';
      case 'documents':
        return 'Compliance & Document Vault';
      case 'tasks':
        return 'Field Operations & Task Board';
      case 'ai-advisor':
        return 'AGRICORE AI Agronomist';
      case 'reports':
        return 'Reporting & Business Intelligence';
      case 'superadmin':
        return 'Super Administrator Control';
      default:
        return 'System Console';
    }
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-neutral-200 px-4 md:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="font-medium text-emerald-800">{activeFarm?.name}</span>
              <span aria-hidden="true">/</span>
              <span className="text-neutral-600">{activeFarm?.county} County</span>
            </div>
            <h1 className="text-sm md:text-base font-bold text-neutral-900 leading-tight">
              {getBreadcrumbTitle()}
            </h1>
          </div>
        </div>

        {/* Right Zone Controls: Weather, Currency, Role, Quick Action */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Microclimate Weather Snippet */}
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-neutral-100/90 border border-neutral-200 text-xs">
            <div className="text-amber-700">
              {weatherData.precipitationProbPct > 50 ? (
                <CloudRain className="w-4 h-4 text-emerald-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-600" />
              )}
            </div>
            <div>
              <div className="font-semibold text-neutral-900 font-mono tabular-nums leading-tight">
                {weatherData.temperatureC}°C · {weatherData.condition}
              </div>
              <div className="text-[10px] text-neutral-500">
                Moisture: {weatherData.soilMoisturePct}% VWC
              </div>
            </div>
            <button
              onClick={handleRefreshWeather}
              title="Refresh weather station"
              className="p-1 hover:text-emerald-800 transition-transform active:rotate-180 text-neutral-400"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshingWeather ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center p-0.5 bg-neutral-100 rounded-lg border border-neutral-200 text-xs">
            <button
              onClick={() => setCurrency('KES')}
              className={`px-2.5 py-1 rounded-md font-semibold font-mono text-[11px] transition-colors ${
                currency === 'KES'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              KES
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-md font-semibold font-mono text-[11px] transition-colors ${
                currency === 'USD'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              USD
            </button>
          </div>

          {/* Role Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1 text-xs">
            <Shield className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-medium text-neutral-800 focus:outline-none cursor-pointer"
            >
              {rolesList.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Record Action Button */}
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Record Entry</span>
          </button>
        </div>
      </header>

      {/* Quick Add Modal */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-sm">Quick Agricultural Record</h3>
              <button
                onClick={() => setIsQuickAddOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 my-3">
              Select which operational activity you want to log for <strong>{activeFarm?.name}</strong>:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  setCurrentView('crops');
                }}
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all"
              >
                <Sprout className="w-5 h-5 text-emerald-700 mb-2" />
                <div className="text-xs font-semibold text-neutral-900">New Crop Cycle</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Planting & seed allocation</div>
              </button>

              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  setCurrentView('livestock');
                }}
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all"
              >
                <Milk className="w-5 h-5 text-emerald-700 mb-2" />
                <div className="text-xs font-semibold text-neutral-900">Log Daily Milk</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Morning & evening litres</div>
              </button>

              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  setCurrentView('finance');
                }}
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all"
              >
                <DollarSign className="w-5 h-5 text-emerald-700 mb-2" />
                <div className="text-xs font-semibold text-neutral-900">M-Pesa / Expense</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Disburse wages or log input</div>
              </button>

              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  setCurrentView('tasks');
                }}
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all"
              >
                <CheckSquare className="w-5 h-5 text-emerald-700 mb-2" />
                <div className="text-xs font-semibold text-neutral-900">Assign Field Task</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Worker priority & deadline</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
