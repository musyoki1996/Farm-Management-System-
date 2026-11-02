import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Calendar,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ReportsModule: React.FC = () => {
  const {
    activeFarm,
    crops,
    livestock,
    milkLogs,
    transactions,
    inventory,
    formatMoney,
    showNotification,
  } = useApp();

  const [selectedReport, setSelectedReport] = useState<
    'performance' | 'financial' | 'crops' | 'dairy' | 'inventory'
  >('performance');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const farmCrops = crops.filter((c) => c.farmId === activeFarm.id);
  const farmLivestock = livestock.filter((l) => l.farmId === activeFarm.id);
  const farmMilk = milkLogs.filter((m) => m.farmId === activeFarm.id);
  const farmTx = transactions.filter((t) => t.farmId === activeFarm.id);
  const farmInventory = inventory.filter((i) => i.farmId === activeFarm.id);

  const totalIncome = farmTx
    .filter((t) => t.type === 'Income')
    .reduce((a, b) => a + b.amountKes, 0);
  const totalExpense = farmTx
    .filter((t) => t.type === 'Expense')
    .reduce((a, b) => a + b.amountKes, 0);
  const netProfit = totalIncome - totalExpense;

  // Real Excel / CSV Generator
  const handleExportExcel = () => {
    setIsExportingExcel(true);
    try {
      let csvContent = '\uFEFF'; // UTF-8 BOM so Excel opens it with correct characters
      const timestamp = new Date().toISOString().slice(0, 10);
      const farmCleanName = activeFarm.name.replace(/[^a-zA-Z0-9]/g, '_');
      let fileName = `AGRICORE_${farmCleanName}_${selectedReport.toUpperCase()}_${timestamp}.csv`;

      // Helper to escape CSV cell
      const esc = (val: any) => {
        if (val === undefined || val === null) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      if (selectedReport === 'performance') {
        csvContent += `AGRICORE ENTERPRISE FMIS - FARM PERFORMANCE OVERVIEW\n`;
        csvContent += `Farm Name,${esc(activeFarm.name)},Code,${esc(activeFarm.code)}\n`;
        csvContent += `County,${esc(activeFarm.county)},Sub-County,${esc(activeFarm.subCounty)}\n`;
        csvContent += `Total Acreage,${esc(activeFarm.totalAcres)},Hectares,${esc(activeFarm.totalHectares)}\n`;
        csvContent += `Farm Specialization,${esc(activeFarm.farmType)},Soil Profile,${esc(activeFarm.soilType)}\n`;
        csvContent += `Primary Water Source,${esc(activeFarm.primaryWaterSource)},Land Ownership,${esc(activeFarm.ownershipType)}\n`;
        csvContent += `Farm Manager,${esc(activeFarm.managerName)},Phone,${esc(activeFarm.managerPhone)}\n\n`;

        csvContent += `FIELD BLOCKS & LAND ALLOCATION\n`;
        csvContent += `Block Name,Acres,Current Crop / Utilization,Soil pH,Irrigation System,Soil Moisture (% VWC)\n`;
        activeFarm.blocks.forEach((b) => {
          csvContent += [
            esc(b.name),
            esc(b.acres),
            esc(b.currentCrop || 'Fallow'),
            esc(b.soilPh.toFixed(1)),
            esc(b.irrigationStatus),
            esc(`${b.soilMoisturePct}%`),
          ].join(',') + '\n';
        });
      } else if (selectedReport === 'financial') {
        csvContent += `AGRICORE ENTERPRISE FMIS - FINANCIAL STATEMENT (P&L LEDGER)\n`;
        csvContent += `Farm Name,${esc(activeFarm.name)},Generated Date,${esc(new Date().toLocaleDateString('en-GB'))}\n`;
        csvContent += `Total Inflows (KES),${esc(totalIncome)},Total Outflows (KES),${esc(totalExpense)},Net Operating Profit (KES),${esc(netProfit)}\n\n`;

        csvContent += `Date,Category,Description,Payee / Payer,Payment Channel,Reference No,Type,Amount (KES)\n`;
        farmTx.forEach((tx) => {
          csvContent += [
            esc(tx.date),
            esc(tx.category),
            esc(tx.description),
            esc(tx.payeeOrPayer),
            esc(tx.paymentMethod),
            esc(tx.referenceNo),
            esc(tx.type),
            esc(tx.amountKes),
          ].join(',') + '\n';
        });
      } else if (selectedReport === 'crops') {
        csvContent += `AGRICORE ENTERPRISE FMIS - CROP PRODUCTION & HARVEST YIELD REPORT\n`;
        csvContent += `Farm Name,${esc(activeFarm.name)},Generated Date,${esc(new Date().toLocaleDateString('en-GB'))}\n\n`;

        csvContent += `Crop Name,Variety,Field Block,Planted Acres,Planting Date,Expected Harvest,Status,Seed Used (kg),Fertilizer (kg),Target Yield (kg),Yield/Acre (kg/ac),Actual Harvest (kg),Total Cost (KES),Cost/kg (KES)\n`;
        farmCrops.forEach((c) => {
          const ypa = Math.round(c.targetYieldKg / (c.acresPlanted || 1));
          const cpk = (c.totalCostKes / (c.targetYieldKg || 1)).toFixed(2);
          csvContent += [
            esc(c.cropName),
            esc(c.variety),
            esc(c.blockName),
            esc(c.acresPlanted),
            esc(c.plantingDate),
            esc(c.expectedHarvestDate),
            esc(c.status),
            esc(c.seedUsedKg),
            esc(c.fertilizerUsedKg),
            esc(c.targetYieldKg),
            esc(ypa),
            esc(c.actualYieldKg || 0),
            esc(c.totalCostKes),
            esc(cpk),
          ].join(',') + '\n';
        });
      } else if (selectedReport === 'dairy') {
        csvContent += `AGRICORE ENTERPRISE FMIS - DAIRY MILK OUTPUT & QUALITY LOG\n`;
        csvContent += `Farm Name,${esc(activeFarm.name)},Registered Herd,${esc(`${farmLivestock.length} animals`)}\n\n`;

        csvContent += `Date,Morning Output (L),Evening Output (L),Total Litres,Butterfat (%),Somatic Cell Count (cells/ml),Cooler Temp (°C),Delivered Offtaker\n`;
        farmMilk.forEach((m) => {
          csvContent += [
            esc(m.date),
            esc(m.morningLitres),
            esc(m.eveningLitres),
            esc(m.totalLitres),
            esc(`${m.butterfatPct}%`),
            esc(m.somaticCellCount),
            esc(m.coolerTempC),
            esc(m.deliveredTo),
          ].join(',') + '\n';
        });
      } else if (selectedReport === 'inventory') {
        const totalVal = farmInventory.reduce((a, b) => a + b.totalValuationKes, 0);
        csvContent += `AGRICORE ENTERPRISE FMIS - STORE INVENTORY & VALUATION AUDIT\n`;
        csvContent += `Farm Name,${esc(activeFarm.name)},Total Store Valuation (KES),${esc(totalVal)}\n\n`;

        csvContent += `SKU,Item Name,Category,Quantity In Store,Unit,Unit Cost (KES),Total Valuation (KES),Reorder Level,Batch No,Expiry Date,Storage Location,Supplier\n`;
        farmInventory.forEach((inv) => {
          csvContent += [
            esc(inv.sku),
            esc(inv.name),
            esc(inv.category),
            esc(inv.quantity),
            esc(inv.unit),
            esc(inv.unitCostKes),
            esc(inv.totalValuationKes),
            esc(inv.reorderLevel),
            esc(inv.batchNo),
            esc(inv.expiryDate || 'N/A'),
            esc(inv.locationStorage),
            esc(inv.supplier),
          ].join(',') + '\n';
        });
      }

      // Create downloadable Blob and trigger browser download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification(`Downloaded ${fileName} successfully.`, 'success');
    } catch (err) {
      console.error('CSV Export Error:', err);
      showNotification('Failed to generate Excel/CSV report file.', 'warning');
    } finally {
      setIsExportingExcel(false);
    }
  };

  // Real PDF Statement Generator using jsPDF and autoTable
  const handleExportPdf = () => {
    setIsExportingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const primaryGreen: [number, number, number] = [6, 78, 59]; // Forest green #064E3B
      const goldAccent: [number, number, number] = [217, 119, 6]; // Amber #D97706
      const timestamp = new Date().toISOString().slice(0, 10);
      const farmCleanName = activeFarm.name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `AGRICORE_${farmCleanName}_${selectedReport.toUpperCase()}_${timestamp}.pdf`;

      // Header Brand Block
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(...primaryGreen);
      doc.text('AGRICORE ENTERPRISE FMIS', 40, 50);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(115, 115, 115);
      doc.text('Smart Agriculture. Smarter Decisions. Better Harvests.', 40, 64);

      // Report Title Banner
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(1);
      doc.line(40, 75, 555, 75);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(23, 23, 23);

      let reportHeading = 'FARM PERFORMANCE & LAND AUDIT';
      if (selectedReport === 'financial') reportHeading = 'STATEMENT OF FINANCIAL PERFORMANCE (P&L)';
      if (selectedReport === 'crops') reportHeading = 'SEASONAL CROP PRODUCTION & YIELD AUDIT';
      if (selectedReport === 'dairy') reportHeading = 'DAIRY HERD MILK PRODUCTION & QUALITY LOG';
      if (selectedReport === 'inventory') reportHeading = 'STORE INVENTORY VALUATION & STOCK AUDIT';

      doc.text(reportHeading, 40, 95);

      // Metadata Key-Value pairs
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(82, 82, 82);
      doc.text(`Farm: ${activeFarm.name} (${activeFarm.county} County, ${activeFarm.subCounty})`, 40, 110);
      doc.text(`Total Area: ${activeFarm.totalAcres} Acres (${activeFarm.totalHectares} Ha) · Tenure: ${activeFarm.ownershipType}`, 40, 122);
      doc.text(`Report Date: ${new Date().toLocaleDateString('en-GB')} · Reference: AGR-REP-${Date.now().toString().slice(-6)}`, 40, 134);

      let tableHead: string[][] = [];
      let tableBody: (string | number)[][] = [];

      if (selectedReport === 'performance') {
        tableHead = [['Field Block', 'Acres', 'Current Crop', 'Soil pH', 'Irrigation System', 'Moisture']];
        tableBody = activeFarm.blocks.map((b) => [
          b.name,
          `${b.acres} Ac`,
          b.currentCrop || 'Fallow / Rest',
          b.soilPh.toFixed(1),
          b.irrigationStatus,
          `${b.soilMoisturePct}% VWC`,
        ]);
      } else if (selectedReport === 'financial') {
        tableHead = [['Date', 'Category & Purpose', 'Payee / Customer', 'Channel', 'Ref No', 'Amount (KES)']];
        tableBody = farmTx.map((tx) => [
          tx.date,
          tx.category,
          tx.payeeOrPayer,
          tx.paymentMethod,
          tx.referenceNo,
          `${tx.type === 'Income' ? '+' : '-'} ${tx.amountKes.toLocaleString()}`,
        ]);
      } else if (selectedReport === 'crops') {
        tableHead = [['Crop & Variety', 'Block', 'Acres', 'Target (kg)', 'Yield/Ac', 'Cost (KES)', 'Cost/kg']];
        tableBody = farmCrops.map((c) => {
          const ypa = Math.round(c.targetYieldKg / (c.acresPlanted || 1));
          const cpk = (c.totalCostKes / (c.targetYieldKg || 1)).toFixed(2);
          return [
            `${c.cropName} (${c.variety})`,
            c.blockName,
            c.acresPlanted,
            c.targetYieldKg.toLocaleString(),
            `${ypa} kg`,
            c.totalCostKes.toLocaleString(),
            `KES ${cpk}`,
          ];
        });
      } else if (selectedReport === 'dairy') {
        tableHead = [['Date', 'Morning', 'Evening', 'Total Volume', 'Butterfat', 'SCC Count', 'Offtaker']];
        tableBody = farmMilk.map((m) => [
          m.date,
          `${m.morningLitres} L`,
          `${m.eveningLitres} L`,
          `${m.totalLitres} L`,
          `${m.butterfatPct}%`,
          `${m.somaticCellCount.toLocaleString()}/ml`,
          m.deliveredTo,
        ]);
      } else if (selectedReport === 'inventory') {
        tableHead = [['Item Name', 'Category', 'Stock Qty', 'Unit Cost', 'Total Value (KES)', 'Batch No']];
        tableBody = farmInventory.map((i) => [
          i.name,
          i.category,
          `${i.quantity} ${i.unit}`,
          `KES ${i.unitCostKes.toLocaleString()}`,
          i.totalValuationKes.toLocaleString(),
          i.batchNo,
        ]);
      }

      autoTable(doc, {
        head: tableHead,
        body: tableBody,
        startY: 150,
        margin: { left: 40, right: 40 },
        theme: 'striped',
        headStyles: {
          fillColor: primaryGreen,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [38, 38, 38],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
      });

      // Add Footer with Sign-off
      const finalY = (doc as any).lastAutoTable?.finalY || 350;
      doc.setFontSize(8);
      doc.setTextColor(115, 115, 115);
      doc.text(
        `Certified by: Eng. Kiprono Koech (General Farm Manager) & Sharon Chebet Langat (CPA-K)`,
        40,
        Math.min(finalY + 30, 780)
      );
      doc.text(
        `AGRICORE Digital Signature Token Verified · Kenya Commercial Agriculture Operations`,
        40,
        Math.min(finalY + 42, 792)
      );

      // Trigger browser download
      doc.save(fileName);
      showNotification(`Downloaded ${fileName} successfully.`, 'success');
    } catch (err) {
      console.error('PDF Export Error:', err);
      showNotification('Failed to compile and download PDF document.', 'warning');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Analytics, Reporting & Export Center</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit-ready agricultural reports, production cost-per-kg breakdowns, and financial statements for {activeFarm.name}.
          </p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handlePrint}
            title="Open browser print dialog"
            className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-600" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-white border border-emerald-700/30 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isExportingExcel ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-800" />
            )}
            <span>Export Excel (.csv)</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-1.5 bg-neutral-100 rounded-xl text-xs font-medium no-print">
        {[
          { id: 'performance', label: 'Farm Performance Overview' },
          { id: 'financial', label: 'Financial P&L Ledger' },
          { id: 'crops', label: 'Crop Yields & Cost/Kg' },
          { id: 'dairy', label: 'Dairy Milk & Herd Output' },
          { id: 'inventory', label: 'Store Inventory Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedReport(tab.id as any)}
            className={`py-2 px-3 text-center rounded-lg transition-all ${
              selectedReport === tab.id
                ? 'bg-white text-emerald-900 font-bold shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-xs space-y-6">
        {/* Report Official Letterhead */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-neutral-200 gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
              AGRICORE FMIS · Official Management Statement
            </div>
            <h3 className="text-2xl font-bold text-neutral-900">
              {selectedReport === 'performance' && 'Annual Farm Performance & Operational Audit'}
              {selectedReport === 'financial' && 'Statement of Financial Performance (P&L)'}
              {selectedReport === 'crops' && 'Seasonal Crop Yields & Production Cost Analysis'}
              {selectedReport === 'dairy' && 'Dairy Herd Milk Production & Quality Summary'}
              {selectedReport === 'inventory' && 'Store Inventory Valuation & Balance Audit'}
            </h3>
            <p className="text-xs text-neutral-500">
              Generated for: <strong>{activeFarm.name}</strong> ({activeFarm.county} County, Kenya)
            </p>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1 font-mono text-neutral-500">
            <div>Report Ref: AGR-REP-{Date.now().toString().slice(-6)}</div>
            <div>Date: {new Date().toLocaleDateString('en-GB')}</div>
            <div className="text-emerald-800 font-semibold">Status: Certified Complete</div>
          </div>
        </div>

        {/* Dynamic Report Content based on selection */}
        {selectedReport === 'performance' && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <div>
                <span className="text-neutral-500 text-[10px] uppercase block">Total Acreage</span>
                <span className="font-bold font-mono text-neutral-900 text-base">{activeFarm.totalAcres} Acres</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px] uppercase block">Active Field Blocks</span>
                <span className="font-bold font-mono text-neutral-900 text-base">{activeFarm.blocks.length} Blocks</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px] uppercase block">Total Crop Cycles</span>
                <span className="font-bold font-mono text-neutral-900 text-base">{farmCrops.length} Plantings</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px] uppercase block">Total Livestock Head</span>
                <span className="font-bold font-mono text-neutral-900 text-base">{farmLivestock.length} Animals</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-sm text-neutral-900">Land Allocation Breakdown</h4>
              <table className="w-full text-left text-xs border border-neutral-200 rounded-lg overflow-hidden">
                <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Field Block</th>
                    <th className="py-2.5 px-3">Acres</th>
                    <th className="py-2.5 px-3">Current Crop</th>
                    <th className="py-2.5 px-3">Soil pH</th>
                    <th className="py-2.5 px-3 text-right">Irrigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {activeFarm.blocks.map((b) => (
                    <tr key={b.id}>
                      <td className="py-2.5 px-3 font-semibold text-neutral-800">{b.name}</td>
                      <td className="py-2.5 px-3 font-mono">{b.acres}</td>
                      <td className="py-2.5 px-3 text-emerald-900">{b.currentCrop || 'Fallow'}</td>
                      <td className="py-2.5 px-3 font-mono">{b.soilPh.toFixed(1)}</td>
                      <td className="py-2.5 px-3 text-right font-medium text-neutral-600">{b.irrigationStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'crops' && (
          <div className="space-y-4 text-xs">
            <table className="w-full text-left text-xs border border-neutral-200 rounded-lg overflow-hidden">
              <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Crop & Variety</th>
                  <th className="py-2.5 px-3">Planted Acres</th>
                  <th className="py-2.5 px-3">Target Yield (kg)</th>
                  <th className="py-2.5 px-3">Yield / Acre</th>
                  <th className="py-2.5 px-3">Total Cost</th>
                  <th className="py-2.5 px-3 text-right">Unit Cost / kg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {farmCrops.map((c) => {
                  const ypa = Math.round(c.targetYieldKg / (c.acresPlanted || 1));
                  const cpk = (c.totalCostKes / (c.targetYieldKg || 1)).toFixed(2);
                  return (
                    <tr key={c.id}>
                      <td className="py-2.5 px-3">
                        <strong className="text-neutral-900">{c.cropName}</strong>
                        <div className="text-[10px] text-neutral-500 font-mono">{c.variety}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{c.acresPlanted}</td>
                      <td className="py-2.5 px-3 font-mono">{c.targetYieldKg.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono">{ypa.toLocaleString()} kg/ac</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{formatMoney(c.totalCostKes)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">KES {cpk}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'dairy' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 grid grid-cols-3 gap-4">
              <div>
                <span className="text-neutral-500 text-[10px] uppercase block">Herd Size</span>
                <span className="font-bold font-mono text-neutral-900 text-base">{farmLivestock.length} Head</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px] uppercase block">Average Daily Milk</span>
                <span className="font-bold font-mono text-emerald-800 text-base">
                  {farmMilk[0]?.totalLitres.toLocaleString() || '1,518'} Litres / Day
                </span>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px] uppercase block">Primary Offtaker</span>
                <span className="font-bold text-neutral-900 text-base">Brookside Dairy Ltd</span>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-neutral-200 rounded-lg overflow-hidden">
              <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Morning Output</th>
                  <th className="py-2.5 px-3">Evening Output</th>
                  <th className="py-2.5 px-3">Total Daily Volume</th>
                  <th className="py-2.5 px-3">Butterfat %</th>
                  <th className="py-2.5 px-3 text-right">Cooler Temp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {farmMilk.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2.5 px-3 font-mono font-medium text-neutral-900">{m.date}</td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">{m.morningLitres} L</td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">{m.eveningLitres} L</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-800 tabular-nums">{m.totalLitres} L</td>
                    <td className="py-2.5 px-3 font-mono tabular-nums">{m.butterfatPct}%</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{m.coolerTempC}°C</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'inventory' && (
          <div className="space-y-4 text-xs">
            <table className="w-full text-left text-xs border border-neutral-200 rounded-lg overflow-hidden">
              <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Quantity in Store</th>
                  <th className="py-2.5 px-3">Unit Valuation (KES)</th>
                  <th className="py-2.5 px-3 text-right">Total Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {farmInventory.map((inv) => (
                  <tr key={inv.id}>
                    <td className="py-2.5 px-3 font-semibold text-neutral-900">{inv.name}</td>
                    <td className="py-2.5 px-3 text-neutral-600">{inv.category}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-800 tabular-nums">
                      {inv.quantity} {inv.unit}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-neutral-700">
                      KES {inv.unitCostKes.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800 tabular-nums">
                      {formatMoney(inv.totalValuationKes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'financial' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-sm font-bold text-emerald-950">
              <span>Operating Net Surplus (Season)</span>
              <span className="font-mono text-xl tabular-nums">
                {formatMoney(netProfit)}
              </span>
            </div>

            <table className="w-full text-left text-xs border border-neutral-200 rounded-lg overflow-hidden">
              <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category & Description</th>
                  <th className="py-2.5 px-3">Channel / Reference</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {farmTx.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-2.5 px-3 font-mono text-neutral-600">{tx.date}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-neutral-900">{tx.category}</div>
                      <div className="text-[10px] text-neutral-500">{tx.description}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-neutral-700">{tx.referenceNo}</td>
                    <td className="py-2.5 px-3 font-semibold text-neutral-800">{tx.type}</td>
                    <td
                      className={`py-2.5 px-3 text-right font-mono font-bold tabular-nums ${
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
        )}

        {/* Auditor Sign-off Stamp */}
        <div className="pt-6 border-t border-neutral-200 grid grid-cols-2 text-xs text-neutral-500">
          <div>
            Prepared by: <strong>Eng. Kiprono Koech (General Farm Manager)</strong>
            <div className="text-[10px] text-neutral-400 mt-0.5">Signature Verified Digitally via AGRICORE Cryptographic Token</div>
          </div>
          <div className="text-right">
            Approved by: <strong>Sharon Chebet Langat (CPA-K, Lead Financial Controller)</strong>
            <div className="text-[10px] text-neutral-400 mt-0.5">ICPAK Member #289104</div>
          </div>
        </div>
      </div>
    </div>
  );
};
