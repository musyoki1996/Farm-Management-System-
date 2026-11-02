import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { LandingPage } from './components/public/LandingPage.tsx';
import { AppSidebar } from './components/layout/AppSidebar.tsx';
import { AppHeader } from './components/layout/AppHeader.tsx';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard.tsx';
import { FarmsModule } from './components/modules/FarmsModule.tsx';
import { CropsModule } from './components/modules/CropsModule.tsx';
import { LivestockModule } from './components/modules/LivestockModule.tsx';
import { FinanceModule } from './components/modules/FinanceModule.tsx';
import { InventoryModule } from './components/modules/InventoryModule.tsx';
import { WorkforceModule } from './components/modules/WorkforceModule.tsx';
import { EquipmentModule } from './components/modules/EquipmentModule.tsx';
import { SalesModule } from './components/modules/SalesModule.tsx';
import { ProcurementModule } from './components/modules/ProcurementModule.tsx';
import { IrrigationModule } from './components/modules/IrrigationModule.tsx';
import { DocumentsModule } from './components/modules/DocumentsModule.tsx';
import { TasksModule } from './components/modules/TasksModule.tsx';
import { AiAdvisorModule } from './components/modules/AiAdvisorModule.tsx';
import { ReportsModule } from './components/modules/ReportsModule.tsx';
import { SuperAdminModule } from './components/modules/SuperAdminModule.tsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainAppLayout: React.FC = () => {
  const { currentView, notification } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (currentView === 'website') {
    return <LandingPage />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'farms':
        return <FarmsModule />;
      case 'crops':
        return <CropsModule />;
      case 'livestock':
        return <LivestockModule />;
      case 'finance':
        return <FinanceModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'workforce':
        return <WorkforceModule />;
      case 'equipment':
        return <EquipmentModule />;
      case 'sales':
        return <SalesModule />;
      case 'procurement':
        return <ProcurementModule />;
      case 'irrigation':
        return <IrrigationModule />;
      case 'documents':
        return <DocumentsModule />;
      case 'tasks':
        return <TasksModule />;
      case 'ai-advisor':
        return <AiAdvisorModule />;
      case 'reports':
        return <ReportsModule />;
      case 'superadmin':
        return <SuperAdminModule />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-neutral-100/60 font-sans text-neutral-900 selection:bg-emerald-700 selection:text-white">
      {/* Sidebar Navigation */}
      <AppSidebar isOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AppHeader onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Toast Notification Container */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-neutral-900 text-white p-4 rounded-xl shadow-2xl border border-neutral-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {notification.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
          <div className="text-xs font-medium leading-relaxed flex-1">{notification.message}</div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
