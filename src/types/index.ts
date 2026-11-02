export type UserRole =
  | 'Super Administrator'
  | 'Farm Owner'
  | 'Farm Manager'
  | 'Accountant'
  | 'Agronomist'
  | 'Veterinary Officer'
  | 'Inventory Manager'
  | 'Procurement Officer'
  | 'Human Resource Manager'
  | 'Field Supervisor'
  | 'Farm Worker'
  | 'Read-only Auditor';

export type Currency = 'KES' | 'USD';

export interface FarmBlock {
  id: string;
  name: string;
  acres: number;
  currentCrop?: string;
  soilPh: number;
  irrigationStatus: 'Drip' | 'Pivot' | 'Sprinkler' | 'Rainfed';
  sensorNodeId?: string;
  soilMoisturePct: number;
}

export interface Farm {
  id: string;
  name: string;
  code: string;
  county: string;
  subCounty: string;
  gpsCoordinates: string;
  totalAcres: number;
  totalHectares: number;
  ownershipType: 'Freehold Title' | 'Leasehold 99yr' | 'Agricultural Trust' | 'Customary';
  farmType: 'Commercial Mixed' | 'Crop Production' | 'Dairy & Livestock' | 'Horticulture & Greenhouses' | 'Tea & Coffee Estate';
  soilType: 'Volcanic Loam' | 'Clay Loam' | 'Sandy Loam' | 'Black Cotton';
  primaryWaterSource: 'Solar Borehole' | 'River Intake' | 'Earth Dam' | 'Municipal Pipe';
  managerName: string;
  managerPhone: string;
  blocks: FarmBlock[];
  notes?: string;
  createdAt: string;
}

export interface ScoutingLog {
  id: string;
  date: string;
  scoutedBy: string;
  pestSeverity: 'Low' | 'Medium' | 'High' | 'Severe';
  findings: string;
  recommendedAction: string;
}

export interface CropCycle {
  id: string;
  farmId: string;
  blockId: string;
  blockName: string;
  cropName: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  status: 'Land Preparation' | 'Nursery / Germination' | 'Vegetative Growth' | 'Flowering & Fruiting' | 'Harvesting' | 'Completed';
  acresPlanted: number;
  seedUsedKg: number;
  fertilizerUsedKg: number;
  targetYieldKg: number;
  actualYieldKg?: number;
  totalCostKes: number;
  scoutingLogs: ScoutingLog[];
}

export interface LivestockAnimal {
  id: string;
  farmId: string;
  tagNumber: string;
  name?: string;
  species: 'Dairy Cattle' | 'Beef Cattle' | 'Dairy Goat' | 'Meat Goat' | 'Poultry' | 'Pigs' | 'Sheep';
  breed: string;
  gender: 'Female' | 'Male';
  dob: string;
  weightKg: number;
  healthStatus: 'Healthy' | 'Under Treatment' | 'Quarantine' | 'Dry Period' | 'Sold';
  vaccinationStatus: 'Up to Date' | 'Due for Booster' | 'Pending';
  lactationStage?: '1st Lactation' | '2nd Lactation' | '3rd+ Lactation' | 'Dry' | 'Heifer';
  dailyAverageMilkL?: number;
  lastDewormingDate: string;
}

export interface MilkLog {
  id: string;
  farmId: string;
  date: string;
  morningLitres: number;
  eveningLitres: number;
  totalLitres: number;
  butterfatPct: number;
  somaticCellCount: number;
  collectedBy: string;
  coolerTempC: number;
  deliveredTo: string;
}

export interface EggLog {
  id: string;
  farmId: string;
  date: string;
  flockName: string;
  cratesCollected: number;
  crackedEggs: number;
  feedConsumedKg: number;
}

export interface VetRecord {
  id: string;
  farmId: string;
  animalTag: string;
  date: string;
  diagnosis: string;
  treatment: string;
  drugAdministered: string;
  withdrawalPeriodDays: number;
  vetName: string;
  costKes: number;
}

export interface FinancialTransaction {
  id: string;
  farmId: string;
  type: 'Income' | 'Expense';
  category: string;
  description: string;
  amountKes: number;
  date: string;
  paymentMethod: 'M-Pesa Paybill' | 'M-Pesa B2C' | 'Bank EFT' | 'Cash' | 'Cheque';
  referenceNo: string;
  status: 'Completed' | 'Pending' | 'Reconciled';
  payeeOrPayer: string;
}

export interface InventoryItem {
  id: string;
  farmId: string;
  sku: string;
  name: string;
  category: 'Seeds & Seedlings' | 'Fertilizers & Lime' | 'Crop Protection Chemicals' | 'Animal Feeds & Salt' | 'Veterinary Drugs' | 'Tools & Spares' | 'Fuel & Lubricants' | 'Harvested Produce';
  quantity: number;
  unit: string;
  unitCostKes: number;
  totalValuationKes: number;
  reorderLevel: number;
  batchNo: string;
  expiryDate?: string;
  supplier: string;
  locationStorage: string;
}

export interface Employee {
  id: string;
  farmId: string;
  employeeNo: string;
  fullName: string;
  nationalId: string;
  phone: string;
  department: 'Agronomy & Crops' | 'Dairy & Livestock' | 'Mechanization & Fleet' | 'Finance & Admin' | 'Irrigation & Maintenance' | 'Security';
  role: string;
  employmentType: 'Permanent' | 'Contract' | 'Casual Piece-Rate';
  dailyWageKes: number;
  status: 'Active' | 'On Leave' | 'Suspended';
  mpesaRegistered: boolean;
}

export interface Equipment {
  id: string;
  farmId: string;
  assetCode: string;
  name: string;
  model: string;
  category: 'Tractors' | 'Harvesters & Threshers' | 'Boom Sprayers & Planters' | 'Water Pumps & Generators' | 'Transport Vehicles' | 'Dairy Milling Equipment';
  status: 'Operational' | 'In Service' | 'Maintenance Required' | 'Decommissioned';
  operatingHours: number;
  fuelConsumptionLph: number;
  lastServiceDate: string;
  nextServiceHours: number;
  assignedOperator: string;
}

export interface SalesOrder {
  id: string;
  farmId: string;
  orderNumber: string;
  customerName: string;
  customerType: 'Dairy Processor' | 'Export Aggregator' | 'Wholesale Market' | 'Supermarket Chain' | 'Farmer Cooperative';
  product: string;
  quantity: number;
  unit: string;
  unitPriceKes: number;
  totalAmountKes: number;
  orderDate: string;
  deliveryStatus: 'Pending' | 'Dispatched' | 'Delivered';
  paymentStatus: 'Paid' | 'Partial' | 'Pending Net-30';
  paymentRef?: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: 'Certified Seeds' | 'Fertilizers' | 'Crop Protection Chemicals' | 'Veterinary Supplies' | 'Irrigation Equipment' | 'Machinery Parts' | 'Animal Feeds';
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  paymentTerms: string;
}

export interface PurchaseOrder {
  id: string;
  farmId: string;
  poNumber: string;
  supplierName: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitCostKes: number;
  totalAmountKes: number;
  orderDate: string;
  status: 'Approved' | 'Delivered' | 'Pending Approval';
}

export interface WaterSource {
  id: string;
  farmId: string;
  name: string;
  type: 'Solar Borehole' | 'Earth Dam' | 'River Pump Station' | 'Rainwater Reservoir';
  currentLevelPct: number;
  dailyCapacityM3: number;
  currentExtractionM3: number;
  pumpStatus: 'Active' | 'Standby' | 'Maintenance';
  flowRateLps: number;
  waterQualityPh: number;
}

export interface FarmDocument {
  id: string;
  farmId: string;
  title: string;
  category: 'Title Deeds & Leases' | 'KEPHIS Export Certs' | 'GlobalG.A.P Audit' | 'NEMA Water Permits' | 'Vet Movement Licenses' | 'Supplier Contracts';
  documentNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring in < 30 Days' | 'Expired';
  fileSizeMb: number;
}

export interface FarmTask {
  id: string;
  farmId: string;
  title: string;
  description: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Under Review' | 'Completed';
  assignedTo: string;
  blockLocation: string;
  dueDate: string;
  estimatedHours: number;
  costKes?: number;
}

export interface MarketCommodityPrice {
  crop: string;
  market: 'Nairobi (Wakulima)' | 'Mombasa (Kongowea)' | 'Eldoret' | 'Nakuru' | 'Kisumu';
  unit: string;
  wholesaleKes: number;
  retailKes: number;
  trend: 'up' | 'down' | 'stable';
  changePct: number;
}
