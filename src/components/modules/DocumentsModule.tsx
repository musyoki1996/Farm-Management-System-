import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { FarmDocument } from '../../types/index.ts';
import {
  FileText,
  Plus,
  Search,
  ShieldCheck,
  AlertTriangle,
  Download,
  Calendar,
  X,
  FileCheck,
} from 'lucide-react';

export const DocumentsModule: React.FC = () => {
  const { activeFarm, documents, addDocument } = useApp();
  const farmDocs = documents.filter((d) => d.farmId === activeFarm.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);

  // New Doc state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FarmDocument['category']>('KEPHIS Export Certs');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('Kenya Plant Health Inspectorate Service');
  const [issueDate, setIssueDate] = useState('2026-01-01');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const filteredDocs = farmDocs.filter((doc) => {
    return (
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !documentNumber) return;

    addDocument({
      farmId: activeFarm.id,
      title,
      category,
      documentNumber,
      issuingAuthority,
      issueDate,
      expiryDate,
      status: 'Valid',
      fileSizeMb: +(1.2 + Math.random() * 3).toFixed(1),
    });

    setIsAddDocOpen(false);
    setTitle('');
    setDocumentNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Compliance & Farm Document Vault</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Freehold title deeds, GlobalG.A.P certifications, KEPHIS export licenses, and NEMA water permits for {activeFarm.name}.
          </p>
        </div>
        <button
          onClick={() => setIsAddDocOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search title, document number, or issuer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>
        <span className="text-xs text-neutral-500 font-mono">
          Total Vault Files: {filteredDocs.length} Documents
        </span>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => {
          const isExpiringSoon = doc.status === 'Expiring in < 30 Days';
          return (
            <div key={doc.id} className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between pb-2 border-b border-neutral-100">
                <div className="max-w-[280px]">
                  <h4 className="font-bold text-neutral-900 text-sm">{doc.title}</h4>
                  <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                    {doc.documentNumber} · {doc.fileSizeMb} MB PDF
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isExpiringSoon
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              <div className="text-xs space-y-1 text-neutral-600">
                <div>Issuing Authority: <strong className="text-neutral-800">{doc.issuingAuthority}</strong></div>
                <div>Category: <span className="font-medium text-emerald-800">{doc.category}</span></div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 font-mono text-[11px] text-neutral-500">
                  <span>Issued: {doc.issueDate}</span>
                  <span>Expires: {doc.expiryDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Upload Document */}
      {isAddDocOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-900 text-base">Attach Document to Vault</h3>
              <button onClick={() => setIsAddDocOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Document Title *</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. KEPHIS Phytosanitary Audit 2026"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Title Deeds & Leases">Title Deeds & Leases</option>
                    <option value="KEPHIS Export Certs">KEPHIS Export Certs</option>
                    <option value="GlobalG.A.P Audit">GlobalG.A.P Audit</option>
                    <option value="NEMA Water Permits">NEMA Water Permits</option>
                    <option value="Vet Movement Licenses">Vet Movement Licenses</option>
                    <option value="Supplier Contracts">Supplier Contracts</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Document Reference No *</label>
                  <input
                    required
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="e.g. KEPHIS-EXP-8901"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Issuing Authority / Agency</label>
                <input
                  type="text"
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Date Issued</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddDocOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
