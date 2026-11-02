import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { LivestockAnimal, MilkLog, EggLog, VetRecord } from '../../types/index.ts';
import {
  Tractor,
  Plus,
  Milk,
  Egg,
  HeartPulse,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  X,
  Calendar,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';

export const LivestockModule: React.FC = () => {
  const {
    activeFarm,
    livestock,
    addLivestock,
    updateLivestock,
    milkLogs,
    addMilkLog,
    eggLogs,
    addEggLog,
    vetRecords,
    addVetRecord,
    formatMoney,
  } = useApp();

  const farmAnimals = livestock.filter((a) => a.farmId === activeFarm.id);
  const farmMilk = milkLogs.filter((m) => m.farmId === activeFarm.id);
  const farmEggs = eggLogs.filter((e) => e.farmId === activeFarm.id);
  const farmVets = vetRecords.filter((v) => v.farmId === activeFarm.id);

  const [activeTab, setActiveTab] = useState<'herd' | 'milk' | 'eggs' | 'vet'>('herd');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState(false);
  const [isAddMilkOpen, setIsAddMilkOpen] = useState(false);
  const [isAddEggOpen, setIsAddEggOpen] = useState(false);
  const [isAddVetOpen, setIsAddVetOpen] = useState(false);

  // New Animal form state
  const [tagNumber, setTagNumber] = useState('');
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<LivestockAnimal['species']>('Dairy Cattle');
  const [breed, setBreed] = useState('Pedigree Holstein Friesian');
  const [gender, setGender] = useState<LivestockAnimal['gender']>('Female');
  const [dob, setDob] = useState('2023-01-15');
  const [weightKg, setWeightKg] = useState<number>(540);
  const [healthStatus, setHealthStatus] = useState<LivestockAnimal['healthStatus']>('Healthy');
  const [vaccinationStatus, setVaccinationStatus] = useState<LivestockAnimal['vaccinationStatus']>('Up to Date');
  const [lactationStage, setLactationStage] = useState<LivestockAnimal['lactationStage']>('2nd Lactation');
  const [dailyAverageMilkL, setDailyAverageMilkL] = useState<number>(32);

  // New Milk form state
  const [milkDate, setMilkDate] = useState(new Date().toISOString().split('T')[0]);
  const [morningL, setMorningL] = useState<number>(850);
  const [eveningL, setEveningL] = useState<number>(620);
  const [butterfatPct, setButterfatPct] = useState<number>(3.86);
  const [somaticCellCount, setSomaticCellCount] = useState<number>(160000);
  const [deliveredTo, setDeliveredTo] = useState('Brookside Dairy Kenya Ltd');
  const [collectedBy, setCollectedBy] = useState('Brookside Bulk Tanker');

  // New Egg form state
  const [flockName, setFlockName] = useState('Layers House Unit 1 (Lohmann Brown)');
  const [cratesCollected, setCratesCollected] = useState<number>(145);
  const [crackedEggs, setCrackedEggs] = useState<number>(12);
  const [feedConsumedKg, setFeedConsumedKg] = useState<number>(580);

  // New Vet form state
  const [animalTag, setAnimalTag] = useState(farmAnimals[0]?.tagNumber || 'KE-NKR-0841');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [drugAdministered, setDrugAdministered] = useState('');
  const [withdrawalPeriodDays, setWithdrawalPeriodDays] = useState<number>(3);
  const [vetName, setVetName] = useState('Dr. Joseph Karanja (BVM, UoN)');
  const [vetCostKes, setVetCostKes] = useState<number>(3500);

  const filteredAnimals = farmAnimals.filter((a) => {
    const matchesSearch =
      a.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.name && a.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      a.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies = speciesFilter === 'all' || a.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  const handleCreateAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagNumber) return;

    addLivestock({
      farmId: activeFarm.id,
      tagNumber,
      name: name || undefined,
      species,
      breed,
      gender,
      dob,
      weightKg: Number(weightKg),
      healthStatus,
      vaccinationStatus,
      lactationStage: species.includes('Dairy') ? lactationStage : undefined,
      dailyAverageMilkL: species.includes('Dairy') ? Number(dailyAverageMilkL) : undefined,
      lastDewormingDate: new Date().toISOString().split('T')[0],
    });

    setIsAddAnimalOpen(false);
    setTagNumber('');
    setName('');
  };

  const handleCreateMilk = (e: React.FormEvent) => {
    e.preventDefault();
    const morning = Number(morningL);
    const evening = Number(eveningL);
    addMilkLog({
      farmId: activeFarm.id,
      date: milkDate,
      morningLitres: morning,
      eveningLitres: evening,
      totalLitres: morning + evening,
      butterfatPct: Number(butterfatPct),
      somaticCellCount: Number(somaticCellCount),
      collectedBy,
      coolerTempC: 3.5,
      deliveredTo,
    });

    setIsAddMilkOpen(false);
  };

  const handleCreateEgg = (e: React.FormEvent) => {
    e.preventDefault();
    addEggLog({
      farmId: activeFarm.id,
      date: milkDate,
      flockName,
      cratesCollected: Number(cratesCollected),
      crackedEggs: Number(crackedEggs),
      feedConsumedKg: Number(feedConsumedKg),
    });

    setIsAddEggOpen(false);
  };

  const handleCreateVet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis) return;

    addVetRecord({
      farmId: activeFarm.id,
      animalTag,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      treatment,
      drugAdministered,
      withdrawalPeriodDays: Number(withdrawalPeriodDays),
      vetName,
      costKes: Number(vetCostKes),
    });

    setIsAddVetOpen(false);
    setDiagnosis('');
    setTreatment('');
    setDrugAdministered('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Livestock Herd, Dairy & Poultry Intelligence</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Individual RFID ear tags, lactation performance curves, daily milk collections to processors, and veterinary health records for {activeFarm.name}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'herd' && (
            <button
              onClick={() => setIsAddAnimalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Animal</span>
            </button>
          )}
          {activeTab === 'milk' && (
            <button
              onClick={() => setIsAddMilkOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Daily Milk</span>
            </button>
          )}
          {activeTab === 'eggs' && (
            <button
              onClick={() => setIsAddEggOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Egg Harvest</span>
            </button>
          )}
          {activeTab === 'vet' && (
            <button
              onClick={() => setIsAddVetOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Vet Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl max-w-md text-xs font-medium">
        <button
          onClick={() => setActiveTab('herd')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'herd' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Herd Registry ({farmAnimals.length})
        </button>
        <button
          onClick={() => setActiveTab('milk')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'milk' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Daily Milk Logs
        </button>
        <button
          onClick={() => setActiveTab('eggs')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'eggs' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Poultry & Eggs
        </button>
        <button
          onClick={() => setActiveTab('vet')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'vet' ? 'bg-white text-emerald-900 font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Vet & Vaccinations
        </button>
      </div>

      {/* Tab 1: Herd Registry */}
      {activeTab === 'herd' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tag number, name, or breed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-neutral-100 rounded-lg text-xs">
              {['all', 'Dairy Cattle', 'Beef Cattle', 'Dairy Goat', 'Poultry'].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpeciesFilter(sp)}
                  className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                    speciesFilter === sp ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {sp === 'all' ? 'All Species' : sp}
                </button>
              ))}
            </div>
          </div>

          {/* Herd Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Tag / Identification</th>
                  <th className="py-3 px-4">Species & Breed</th>
                  <th className="py-3 px-4">Age / DOB</th>
                  <th className="py-3 px-4">Weight (kg)</th>
                  <th className="py-3 px-4">Lactation / Yield</th>
                  <th className="py-3 px-4">Health Status</th>
                  <th className="py-3 px-4 text-right">Vaccination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredAnimals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900 font-mono">{animal.tagNumber}</div>
                      {animal.name && <div className="text-[11px] text-neutral-500">{animal.name}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-800">{animal.species}</div>
                      <div className="text-[11px] text-neutral-500">{animal.breed} ({animal.gender})</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-600 tabular-nums">{animal.dob}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-neutral-900 tabular-nums">
                      {animal.weightKg} kg
                    </td>
                    <td className="py-3 px-4">
                      {animal.dailyAverageMilkL ? (
                        <div>
                          <span className="font-bold font-mono text-emerald-800 tabular-nums">
                            {animal.dailyAverageMilkL} L/day
                          </span>
                          <span className="text-[10px] text-neutral-400 block">{animal.lactationStage}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800">
                        {animal.healthStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-700">
                        {animal.vaccinationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Daily Milk Logs */}
      {activeTab === 'milk' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 text-xs uppercase block">Latest Total Volume</span>
              <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                {farmMilk[0]?.totalLitres.toLocaleString() || 0} Litres
              </span>
              <span className="text-xs text-neutral-500 block mt-1">Delivered to: {farmMilk[0]?.deliveredTo}</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 text-xs uppercase block">Average Butterfat</span>
              <span className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">3.88%</span>
              <span className="text-xs text-neutral-500 block mt-1">Standard: 3.20% minimum</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 text-xs uppercase block">Bulk Tank Cooler</span>
              <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">3.5°C</span>
              <span className="text-xs text-emerald-700 block mt-1">DeLaval 5,000L Chiller Active</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Morning (L)</th>
                  <th className="py-3 px-4">Evening (L)</th>
                  <th className="py-3 px-4">Total Output</th>
                  <th className="py-3 px-4">Butterfat %</th>
                  <th className="py-3 px-4">Somatic Cell Count</th>
                  <th className="py-3 px-4 text-right">Recipient Tanker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {farmMilk.map((m) => (
                  <tr key={m.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-neutral-900">{m.date}</td>
                    <td className="py-3 px-4 font-mono tabular-nums">{m.morningLitres} L</td>
                    <td className="py-3 px-4 font-mono tabular-nums">{m.eveningLitres} L</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800 tabular-nums">{m.totalLitres} L</td>
                    <td className="py-3 px-4 font-mono tabular-nums">{m.butterfatPct}%</td>
                    <td className="py-3 px-4 font-mono tabular-nums">{m.somaticCellCount.toLocaleString()} /ml</td>
                    <td className="py-3 px-4 text-right text-neutral-600 font-medium">{m.collectedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Poultry & Eggs */}
      {activeTab === 'eggs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 text-xs uppercase block">Egg Collection Today</span>
              <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                {farmEggs[0]?.cratesCollected || 0} Crates (~{(farmEggs[0]?.cratesCollected || 0) * 30} Eggs)
              </span>
              <span className="text-xs text-neutral-500 block mt-1">Lay rate: 88.8% flock productivity</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 text-xs uppercase block">Rejection / Cracked</span>
              <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                {farmEggs[0]?.crackedEggs || 0} Eggs
              </span>
              <span className="text-xs text-neutral-500 block mt-1">0.36% damage rate</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 text-xs uppercase block">Daily Feed Consumption</span>
              <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
                {farmEggs[0]?.feedConsumedKg || 0} kg
              </span>
              <span className="text-xs text-neutral-500 block mt-1">Unga Layers Complete Mash</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Flock Designation</th>
                  <th className="py-3 px-4">Crates (30 Eggs)</th>
                  <th className="py-3 px-4">Total Table Eggs</th>
                  <th className="py-3 px-4">Cracked / Loss</th>
                  <th className="py-3 px-4 text-right">Feed Consumed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {farmEggs.map((egg) => (
                  <tr key={egg.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-neutral-900">{egg.date}</td>
                    <td className="py-3 px-4 font-semibold text-neutral-800">{egg.flockName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-700 tabular-nums">{egg.cratesCollected}</td>
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 tabular-nums">
                      {(egg.cratesCollected * 30).toLocaleString()} eggs
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-600 tabular-nums">{egg.crackedEggs}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">{egg.feedConsumedKg} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Veterinary Records & Health */}
      {activeTab === 'vet' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Animal Tag</th>
                  <th className="py-3 px-4">Diagnosis / Condition</th>
                  <th className="py-3 px-4">Prescribed Drug & Treatment</th>
                  <th className="py-3 px-4">Milk/Meat Withdrawal</th>
                  <th className="py-3 px-4">Attending Vet</th>
                  <th className="py-3 px-4 text-right">Cost (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {farmVets.map((v) => (
                  <tr key={v.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-neutral-600">{v.date}</td>
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">{v.animalTag}</td>
                    <td className="py-3 px-4 font-medium text-neutral-900">{v.diagnosis}</td>
                    <td className="py-3 px-4 text-neutral-700">{v.drugAdministered}</td>
                    <td className="py-3 px-4">
                      {v.withdrawalPeriodDays > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900">
                          {v.withdrawalPeriodDays} Days Withdrawal
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">Zero</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">{v.vetName}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900 tabular-nums">
                      {formatMoney(v.costKes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Register Animal */}
      {isAddAnimalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Register Animal Profile</h3>
              <button onClick={() => setIsAddAnimalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnimal} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Ear Tag / RFID Code *</label>
                  <input
                    required
                    type="text"
                    value={tagNumber}
                    onChange={(e) => setTagNumber(e.target.value)}
                    placeholder="e.g. KE-NKR-0860"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Animal Nickname</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Daisy Supreme"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Species</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Dairy Cattle">Dairy Cattle</option>
                    <option value="Beef Cattle">Beef Cattle</option>
                    <option value="Dairy Goat">Dairy Goat</option>
                    <option value="Meat Goat">Meat Goat</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Pigs">Pigs</option>
                    <option value="Sheep">Sheep</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Breed</label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Live Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Health Status</label>
                  <select
                    value={healthStatus}
                    onChange={(e) => setHealthStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Under Treatment">Under Treatment</option>
                    <option value="Quarantine">Quarantine</option>
                    <option value="Dry Period">Dry Period</option>
                  </select>
                </div>
              </div>

              {species.includes('Dairy') && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Lactation Stage</label>
                    <select
                      value={lactationStage}
                      onChange={(e) => setLactationStage(e.target.value as any)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                    >
                      <option value="1st Lactation">1st Lactation</option>
                      <option value="2nd Lactation">2nd Lactation</option>
                      <option value="3rd+ Lactation">3rd+ Lactation</option>
                      <option value="Dry">Dry</option>
                      <option value="Heifer">Heifer</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Daily Average Milk (L)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={dailyAverageMilkL}
                      onChange={(e) => setDailyAverageMilkL(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddAnimalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Register Animal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Daily Milk */}
      {isAddMilkOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Record Daily Dairy Milk Yield</h3>
              <button onClick={() => setIsAddMilkOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMilk} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Collection Date</label>
                <input
                  type="date"
                  value={milkDate}
                  onChange={(e) => setMilkDate(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Morning Milking (Litres) *</label>
                  <input
                    required
                    type="number"
                    value={morningL}
                    onChange={(e) => setMorningL(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Evening Milking (Litres) *</label>
                  <input
                    required
                    type="number"
                    value={eveningL}
                    onChange={(e) => setEveningL(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Butterfat Test %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={butterfatPct}
                    onChange={(e) => setButterfatPct(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">SCC (cells/ml)</label>
                  <input
                    type="number"
                    value={somaticCellCount}
                    onChange={(e) => setSomaticCellCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Delivered Processor / Offtaker</label>
                <input
                  type="text"
                  value={deliveredTo}
                  onChange={(e) => setDeliveredTo(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddMilkOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Milk Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Vet Treatment */}
      {isAddVetOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Record Veterinary Intervention</h3>
              <button onClick={() => setIsAddVetOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVet} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Target Animal Tag *</label>
                <input
                  required
                  type="text"
                  value={animalTag}
                  onChange={(e) => setAnimalTag(e.target.value)}
                  placeholder="e.g. KE-NKR-0842"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Clinical Diagnosis *</label>
                <input
                  required
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Mastitis in left-quarter / ECF fever spike"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Drug & Dosage Administered</label>
                <input
                  type="text"
                  value={drugAdministered}
                  onChange={(e) => setDrugAdministered(e.target.value)}
                  placeholder="e.g. Synulox LC intramammary + Ketoprofen"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Milk/Meat Withdrawal (Days)</label>
                  <input
                    type="number"
                    value={withdrawalPeriodDays}
                    onChange={(e) => setWithdrawalPeriodDays(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Cost of Treatment (KES)</label>
                  <input
                    type="number"
                    value={vetCostKes}
                    onChange={(e) => setVetCostKes(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Attending Licensed Veterinarian</label>
                <input
                  type="text"
                  value={vetName}
                  onChange={(e) => setVetName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddVetOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Record Vet Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
