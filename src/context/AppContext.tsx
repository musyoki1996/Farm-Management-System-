import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Farm,
  CropCycle,
  LivestockAnimal,
  MilkLog,
  EggLog,
  VetRecord,
  FinancialTransaction,
  InventoryItem,
  Employee,
  Equipment,
  SalesOrder,
  Supplier,
  PurchaseOrder,
  WaterSource,
  FarmDocument,
  FarmTask,
  MarketCommodityPrice,
  UserRole,
  Currency,
  FarmBlock,
  ScoutingLog,
} from '../types/index.ts';
import {
  INITIAL_FARMS,
  INITIAL_CROPS,
  INITIAL_LIVESTOCK,
  INITIAL_MILK_LOGS,
  INITIAL_EGG_LOGS,
  INITIAL_VET_RECORDS,
  INITIAL_TRANSACTIONS,
  INITIAL_INVENTORY,
  INITIAL_EMPLOYEES,
  INITIAL_EQUIPMENT,
  INITIAL_SALES_ORDERS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_WATER_SOURCES,
  INITIAL_DOCUMENTS,
  INITIAL_TASKS,
  KENYA_COMMODITY_PRICES,
} from '../data/initialData.ts';

export type AppView =
  | 'website'
  | 'dashboard'
  | 'farms'
  | 'crops'
  | 'livestock'
  | 'finance'
  | 'inventory'
  | 'workforce'
  | 'equipment'
  | 'sales'
  | 'procurement'
  | 'irrigation'
  | 'documents'
  | 'tasks'
  | 'ai-advisor'
  | 'reports'
  | 'superadmin';

export interface WeatherInfo {
  county: string;
  subCounty: string;
  temperatureC: number;
  condition: string;
  humidity: number;
  windSpeedKmH: number;
  soilMoisturePct: number;
  rainfall7DaysMm: number;
  precipitationProbPct: number;
  advisory: string;
  seasonStatus: string;
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedFarmId: string;
  setSelectedFarmId: (id: string) => void;
  activeFarm: Farm;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatMoney: (amountKes: number) => string;

  // Entities
  farms: Farm[];
  addFarm: (farm: Omit<Farm, 'id' | 'createdAt'>) => void;
  updateFarm: (farm: Farm) => void;
  addBlockToFarm: (farmId: string, block: Omit<FarmBlock, 'id'>) => void;

  crops: CropCycle[];
  addCropCycle: (crop: Omit<CropCycle, 'id' | 'scoutingLogs'>) => void;
  updateCropCycle: (crop: CropCycle) => void;
  addScoutingLog: (cropId: string, log: Omit<ScoutingLog, 'id'>) => void;

  livestock: LivestockAnimal[];
  addLivestock: (animal: Omit<LivestockAnimal, 'id'>) => void;
  updateLivestock: (animal: LivestockAnimal) => void;

  milkLogs: MilkLog[];
  addMilkLog: (log: Omit<MilkLog, 'id'>) => void;

  eggLogs: EggLog[];
  addEggLog: (log: Omit<EggLog, 'id'>) => void;

  vetRecords: VetRecord[];
  addVetRecord: (record: Omit<VetRecord, 'id'>) => void;

  transactions: FinancialTransaction[];
  addTransaction: (tx: Omit<FinancialTransaction, 'id'>) => void;

  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'totalValuationKes'>) => void;
  updateInventoryStock: (itemId: string, qtyDelta: number, reason: string) => void;

  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (emp: Employee) => void;

  equipment: Equipment[];
  addEquipment: (eq: Omit<Equipment, 'id'>) => void;
  updateEquipment: (eq: Equipment) => void;

  salesOrders: SalesOrder[];
  addSalesOrder: (so: Omit<SalesOrder, 'id'>) => void;
  updateSalesOrder: (so: SalesOrder) => void;

  suppliers: Supplier[];
  addSupplier: (sup: Omit<Supplier, 'id'>) => void;

  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;

  waterSources: WaterSource[];
  addWaterSource: (ws: Omit<WaterSource, 'id'>) => void;
  updateWaterSource: (ws: WaterSource) => void;

  documents: FarmDocument[];
  addDocument: (doc: Omit<FarmDocument, 'id'>) => void;

  tasks: FarmTask[];
  addTask: (task: Omit<FarmTask, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: FarmTask['status']) => void;
  deleteTask: (taskId: string) => void;

  commodityPrices: MarketCommodityPrice[];

  // Weather & Integrations
  weatherData: WeatherInfo;
  refreshWeather: (countyName?: string) => Promise<void>;
  simulateMpesa: (type: 'B2C' | 'C2B', amount: number, phone: string, reference: string, recipientName?: string) => Promise<any>;

  // Notification Toast
  notification: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`agricore_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('website');
  const [selectedFarmId, setSelectedFarmId] = useState<string>('farm-001');
  const [currentRole, setCurrentRole] = useState<UserRole>('Farm Owner');
  const [currency, setCurrency] = useState<Currency>('KES');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Entities initialized from LocalStorage or default datasets
  const [farms, setFarms] = useState<Farm[]>(() => loadStorage('farms', INITIAL_FARMS));
  const [crops, setCrops] = useState<CropCycle[]>(() => loadStorage('crops', INITIAL_CROPS));
  const [livestock, setLivestock] = useState<LivestockAnimal[]>(() => loadStorage('livestock', INITIAL_LIVESTOCK));
  const [milkLogs, setMilkLogs] = useState<MilkLog[]>(() => loadStorage('milkLogs', INITIAL_MILK_LOGS));
  const [eggLogs, setEggLogs] = useState<EggLog[]>(() => loadStorage('eggLogs', INITIAL_EGG_LOGS));
  const [vetRecords, setVetRecords] = useState<VetRecord[]>(() => loadStorage('vetRecords', INITIAL_VET_RECORDS));
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => loadStorage('transactions', INITIAL_TRANSACTIONS));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadStorage('inventory', INITIAL_INVENTORY));
  const [employees, setEmployees] = useState<Employee[]>(() => loadStorage('employees', INITIAL_EMPLOYEES));
  const [equipment, setEquipment] = useState<Equipment[]>(() => loadStorage('equipment', INITIAL_EQUIPMENT));
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(() => loadStorage('salesOrders', INITIAL_SALES_ORDERS));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadStorage('suppliers', INITIAL_SUPPLIERS));
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => loadStorage('purchaseOrders', INITIAL_PURCHASE_ORDERS));
  const [waterSources, setWaterSources] = useState<WaterSource[]>(() => loadStorage('waterSources', INITIAL_WATER_SOURCES));
  const [documents, setDocuments] = useState<FarmDocument[]>(() => loadStorage('documents', INITIAL_DOCUMENTS));
  const [tasks, setTasks] = useState<FarmTask[]>(() => loadStorage('tasks', INITIAL_TASKS));
  const [commodityPrices] = useState<MarketCommodityPrice[]>(KENYA_COMMODITY_PRICES);

  // Fallback initial weather
  const [weatherData, setWeatherData] = useState<WeatherInfo>({
    county: 'Nakuru',
    subCounty: 'Rongai / Njoro',
    temperatureC: 22,
    condition: 'Partly Cloudy',
    humidity: 64,
    windSpeedKmH: 14,
    soilMoisturePct: 42,
    rainfall7DaysMm: 28.5,
    precipitationProbPct: 35,
    advisory: 'Optimal soil moisture for top-dressing and spray operations.',
    seasonStatus: 'Transition to short rains; soil temp 19°C.',
  });

  // Keep activeFarm in sync
  const activeFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];

  // Save to localStorage when entities change
  useEffect(() => {
    localStorage.setItem('agricore_farms', JSON.stringify(farms));
  }, [farms]);
  useEffect(() => {
    localStorage.setItem('agricore_crops', JSON.stringify(crops));
  }, [crops]);
  useEffect(() => {
    localStorage.setItem('agricore_livestock', JSON.stringify(livestock));
  }, [livestock]);
  useEffect(() => {
    localStorage.setItem('agricore_milkLogs', JSON.stringify(milkLogs));
  }, [milkLogs]);
  useEffect(() => {
    localStorage.setItem('agricore_transactions', JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem('agricore_inventory', JSON.stringify(inventory));
  }, [inventory]);
  useEffect(() => {
    localStorage.setItem('agricore_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const refreshWeather = async (countyName?: string) => {
    const targetCounty = countyName || activeFarm.county;
    try {
      const res = await fetch(`/api/weather/${encodeURIComponent(targetCounty)}`);
      const data = await res.json();
      if (data?.data) {
        setWeatherData(data.data);
      }
    } catch (e) {
      console.warn('Weather fetch fallback:', e);
    }
  };

  useEffect(() => {
    if (activeFarm?.county) {
      refreshWeather(activeFarm.county);
    }
  }, [activeFarm?.county]);

  const formatMoney = (amountKes: number) => {
    if (currency === 'USD') {
      const usd = (amountKes / 129).toFixed(2);
      return `$${Number(usd).toLocaleString()}`;
    }
    return `KES ${Math.round(amountKes).toLocaleString()}`;
  };

  const simulateMpesa = async (
    type: 'B2C' | 'C2B',
    amount: number,
    phone: string,
    reference: string,
    recipientName?: string
  ) => {
    try {
      const res = await fetch('/api/mpesa/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount, phone, reference, recipientName }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          `M-Pesa ${type} Transaction Successful: Ref ${data.TransactionID} for KES ${amount.toLocaleString()}`,
          'success'
        );
      }
      return data;
    } catch (e) {
      const mockTransId = `QK${Math.floor(10000000 + Math.random() * 90000000)}`;
      showNotification(`M-Pesa ${type} Approved: Ref ${mockTransId} (KES ${amount.toLocaleString()})`, 'success');
      return { success: true, TransactionID: mockTransId };
    }
  };

  // CRUD Actions
  const addFarm = (farmData: Omit<Farm, 'id' | 'createdAt'>) => {
    const newFarm: Farm = {
      ...farmData,
      id: `farm-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setFarms((prev) => [newFarm, ...prev]);
    setSelectedFarmId(newFarm.id);
    showNotification(`New Farm registered: ${newFarm.name}`);
  };

  const updateFarm = (updated: Farm) => {
    setFarms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    showNotification(`Farm updated: ${updated.name}`);
  };

  const addBlockToFarm = (farmId: string, blockData: Omit<FarmBlock, 'id'>) => {
    const newBlock: FarmBlock = {
      ...blockData,
      id: `blk-${Date.now()}`,
    };
    setFarms((prev) =>
      prev.map((f) => (f.id === farmId ? { ...f, blocks: [...f.blocks, newBlock] } : f))
    );
    showNotification(`Block added: ${newBlock.name}`);
  };

  const addCropCycle = (cropData: Omit<CropCycle, 'id' | 'scoutingLogs'>) => {
    const newCrop: CropCycle = {
      ...cropData,
      id: `crop-${Date.now()}`,
      scoutingLogs: [],
    };
    setCrops((prev) => [newCrop, ...prev]);
    showNotification(`New Crop Cycle logged: ${newCrop.cropName} (${newCrop.variety})`);
  };

  const updateCropCycle = (crop: CropCycle) => {
    setCrops((prev) => prev.map((c) => (c.id === crop.id ? crop : c)));
    showNotification(`Crop cycle updated: ${crop.cropName}`);
  };

  const addScoutingLog = (cropId: string, logData: Omit<ScoutingLog, 'id'>) => {
    const newLog: ScoutingLog = {
      ...logData,
      id: `sc-${Date.now()}`,
    };
    setCrops((prev) =>
      prev.map((c) => (c.id === cropId ? { ...c, scoutingLogs: [newLog, ...c.scoutingLogs] } : c))
    );
    showNotification(`Scouting record saved for crop cycle.`);
  };

  const addLivestock = (animalData: Omit<LivestockAnimal, 'id'>) => {
    const newAnimal: LivestockAnimal = {
      ...animalData,
      id: `ls-${Date.now()}`,
    };
    setLivestock((prev) => [newAnimal, ...prev]);
    showNotification(`Animal registered: ${newAnimal.tagNumber} (${newAnimal.species})`);
  };

  const updateLivestock = (animal: LivestockAnimal) => {
    setLivestock((prev) => prev.map((a) => (a.id === animal.id ? animal : a)));
    showNotification(`Animal updated: ${animal.tagNumber}`);
  };

  const addMilkLog = (logData: Omit<MilkLog, 'id'>) => {
    const newLog: MilkLog = {
      ...logData,
      id: `mlk-${Date.now()}`,
    };
    setMilkLogs((prev) => [newLog, ...prev]);
    showNotification(`Milk record saved: ${newLog.totalLitres} Litres collected.`);
  };

  const addEggLog = (eggData: Omit<EggLog, 'id'>) => {
    const newLog: EggLog = {
      ...eggData,
      id: `egg-${Date.now()}`,
    };
    setEggLogs((prev) => [newLog, ...prev]);
    showNotification(`Egg collection recorded: ${newLog.cratesCollected} crates.`);
  };

  const addVetRecord = (recData: Omit<VetRecord, 'id'>) => {
    const newRec: VetRecord = {
      ...recData,
      id: `vet-${Date.now()}`,
    };
    setVetRecords((prev) => [newRec, ...prev]);
    showNotification(`Veterinary intervention recorded for ${newRec.animalTag}`);
  };

  const addTransaction = (txData: Omit<FinancialTransaction, 'id'>) => {
    const newTx: FinancialTransaction = {
      ...txData,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    showNotification(`Financial ${newTx.type} recorded: KES ${newTx.amountKes.toLocaleString()}`);
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'totalValuationKes'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      totalValuationKes: itemData.quantity * itemData.unitCostKes,
    };
    setInventory((prev) => [newItem, ...prev]);
    showNotification(`Item added to inventory: ${newItem.name}`);
  };

  const updateInventoryStock = (itemId: string, qtyDelta: number, reason: string) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(0, item.quantity + qtyDelta);
          return {
            ...item,
            quantity: newQty,
            totalValuationKes: newQty * item.unitCostKes,
          };
        }
        return item;
      })
    );
    showNotification(`Stock adjusted (${qtyDelta > 0 ? '+' : ''}${qtyDelta}) - ${reason}`);
  };

  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    showNotification(`Worker registered: ${newEmp.fullName}`);
  };

  const updateEmployee = (emp: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? emp : e)));
    showNotification(`Worker profile updated: ${emp.fullName}`);
  };

  const addEquipment = (eqData: Omit<Equipment, 'id'>) => {
    const newEq: Equipment = {
      ...eqData,
      id: `eq-${Date.now()}`,
    };
    setEquipment((prev) => [newEq, ...prev]);
    showNotification(`Machinery added: ${newEq.name}`);
  };

  const updateEquipment = (eq: Equipment) => {
    setEquipment((prev) => prev.map((e) => (e.id === eq.id ? eq : e)));
    showNotification(`Machinery updated: ${eq.name}`);
  };

  const addSalesOrder = (soData: Omit<SalesOrder, 'id'>) => {
    const newSo: SalesOrder = {
      ...soData,
      id: `so-${Date.now()}`,
    };
    setSalesOrders((prev) => [newSo, ...prev]);
    showNotification(`Sales Order created: ${newSo.orderNumber} (${newSo.customerName})`);
  };

  const updateSalesOrder = (so: SalesOrder) => {
    setSalesOrders((prev) => prev.map((item) => (item.id === so.id ? so : item)));
    showNotification(`Order updated: ${so.orderNumber}`);
  };

  const addSupplier = (supData: Omit<Supplier, 'id'>) => {
    const newSup: Supplier = {
      ...supData,
      id: `sup-${Date.now()}`,
    };
    setSuppliers((prev) => [newSup, ...prev]);
    showNotification(`Supplier added: ${newSup.name}`);
  };

  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id'>) => {
    const newPo: PurchaseOrder = {
      ...poData,
      id: `po-${Date.now()}`,
    };
    setPurchaseOrders((prev) => [newPo, ...prev]);
    showNotification(`Purchase Order issued: ${newPo.poNumber}`);
  };

  const addWaterSource = (wsData: Omit<WaterSource, 'id'>) => {
    const newWs: WaterSource = {
      ...wsData,
      id: `ws-${Date.now()}`,
    };
    setWaterSources((prev) => [newWs, ...prev]);
    showNotification(`Water node registered: ${newWs.name}`);
  };

  const updateWaterSource = (ws: WaterSource) => {
    setWaterSources((prev) => prev.map((item) => (item.id === ws.id ? ws : item)));
    showNotification(`Water node updated: ${ws.name}`);
  };

  const addDocument = (docData: Omit<FarmDocument, 'id'>) => {
    const newDoc: FarmDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    showNotification(`Document uploaded: ${newDoc.title}`);
  };

  const addTask = (taskData: Omit<FarmTask, 'id'>) => {
    const newTask: FarmTask = {
      ...taskData,
      id: `tsk-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
    showNotification(`Operational Task assigned: ${newTask.title}`);
  };

  const updateTaskStatus = (taskId: string, status: FarmTask['status']) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    showNotification(`Task status changed to ${status}`);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showNotification(`Task deleted.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedFarmId,
        setSelectedFarmId,
        activeFarm,
        currentRole,
        setCurrentRole,
        currency,
        setCurrency,
        formatMoney,
        farms,
        addFarm,
        updateFarm,
        addBlockToFarm,
        crops,
        addCropCycle,
        updateCropCycle,
        addScoutingLog,
        livestock,
        addLivestock,
        updateLivestock,
        milkLogs,
        addMilkLog,
        eggLogs,
        addEggLog,
        vetRecords,
        addVetRecord,
        transactions,
        addTransaction,
        inventory,
        addInventoryItem,
        updateInventoryStock,
        employees,
        addEmployee,
        updateEmployee,
        equipment,
        addEquipment,
        updateEquipment,
        salesOrders,
        addSalesOrder,
        updateSalesOrder,
        suppliers,
        addSupplier,
        purchaseOrders,
        addPurchaseOrder,
        waterSources,
        addWaterSource,
        updateWaterSource,
        documents,
        addDocument,
        tasks,
        addTask,
        updateTaskStatus,
        deleteTask,
        commodityPrices,
        weatherData,
        refreshWeather,
        simulateMpesa,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
