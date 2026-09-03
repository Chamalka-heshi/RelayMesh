import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Search,
  ArrowUpRight,
  RotateCcw,
  Plus,
  Clock,
  X,
  Package,
  CheckCircle2,
  User
} from 'lucide-react';
import api from '../services/api';
import mockDataStore from '../services/mockDataStore';

export default function ResourcesPage({ onNavigate }) {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [modalType, setModalType] = useState(null); // 'addResource', 'allocate'
  const [toastMessage, setToastMessage] = useState(null);

  // New Resource Form
  const [newResName, setNewResName] = useState('');
  const [newResCategory, setNewResCategory] = useState('MEDICAL');
  const [newResLocation, setNewResLocation] = useState('');
  const [newResTotal, setNewResTotal] = useState('');
  const [newResUnit, setNewResUnit] = useState('Units');
  const [newResContact, setNewResContact] = useState('');

  // Allocation Form
  const [allocateQty, setAllocateQty] = useState('');
  const [allocateSector, setAllocateSector] = useState('Sector 4 (Kelani Flood Basin)');

  const loadResources = async () => {
    try {
      const res = await api.getResources();
      if (res && res.success && res.data) {
        setResources(res.data);
      } else {
        setResources(mockDataStore.getState().resources);
      }
    } catch (e) {
      console.error('Error fetching resources:', e);
      setResources(mockDataStore.getState().resources);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!newResName.trim()) return;

    try {
      await api.addResource({
        name: newResName,
        category: newResCategory,
        location: newResLocation || 'Central Disaster Zone',
        total: Number(newResTotal) || 100,
        available: Number(newResTotal) || 100,
        unit: newResUnit || 'Units',
        contactPerson: newResContact || 'Central Division'
      });

      setToastMessage(`Resource depot "${newResName}" registered & synchronized!`);
      setModalType(null);
      setNewResName('');
      setNewResTotal('');
      await loadResources();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Error adding resource:', err);
    }
  };

  const handleAllocateStock = async () => {
    if (!selectedResource) return;
    const qty = Number(allocateQty) || Math.min(10, selectedResource.available);

    try {
      await api.allocateResource(selectedResource.id, qty, allocateSector);
      setToastMessage(`Dispatched ${qty} ${selectedResource.unit} from "${selectedResource.name}" to ${allocateSector}!`);
      setSelectedResource(null);
      setModalType(null);
      setAllocateQty('');
      await loadResources();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Error allocating stock:', err);
    }
  };

  const filteredResources = useMemo(() => {
    let list = [...resources];

    if (categoryFilter !== 'ALL') {
      list = list.filter((r) => r.category === categoryFilter);
    }

    if (statusFilter !== 'ALL') {
      list = list.filter((r) => r.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }

    return list;
  }, [resources, categoryFilter, statusFilter, searchQuery]);

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'SHELTER':
        return 'priority-moderate'; // Soft blue
      case 'MEDICAL':
        return 'priority-critical'; // Soft red
      case 'WATER':
        return 'priority-high'; // Soft amber
      case 'FOOD':
        return 'priority-low'; // Soft green
      default:
        return 'priority-moderate';
    }
  };

  return (
    <div className="donezo-dashboard-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: '#164E37',
          color: '#FFFFFF',
          padding: '0.85rem 1.4rem',
          borderRadius: 'var(--donezo-radius-pill)',
          boxShadow: '0 10px 25px rgba(22, 78, 55, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Row */}
      <div className="donezo-header-row">
        <div className="donezo-title-group">
          <h1 className="donezo-page-title">Emergency Resource Directory</h1>
          <p className="donezo-page-subtitle">
            Offline-first inventory tracking, emergency supplies allocation & shelter bed capacity.
          </p>
        </div>

        <div className="donezo-header-actions">
          <button
            onClick={() => setModalType('addResource')}
            className="donezo-btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resource Depot</span>
          </button>
          <button
            onClick={() => {
              setIsRefreshing(true);
              loadResources();
            }}
            className="donezo-btn-outline"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-800' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Stock'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="donezo-kpi-grid">
        {/* Card 1: Total Available */}
        <div className="donezo-kpi-card donezo-kpi-featured">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Total Resources Available</span>
            <button className="donezo-kpi-arrow-circle">
              <ArrowUpRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
          <div className="donezo-kpi-number">{resources.length || 6}</div>
          <div className="donezo-kpi-pill-badge">
            <span className="donezo-badge-square">{resources.length}</span>
            <span>Active emergency depots</span>
          </div>
        </div>

        {/* Card 2: Shelter Capacity */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Shelter Bed Capacity</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">1,240 / 1,700</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-emerald-100 text-emerald-700">73%</span>
            <span>Beds occupied across 5 shelters</span>
          </div>
        </div>

        {/* Card 3: Medical Supplies */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Medical & Trauma Kits</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-red-600">42 Units</div>
          <div className="donezo-kpi-pill-badge-light">
            <span className="donezo-badge-square-light bg-red-100 text-red-700">Low Stock</span>
            <span>Resupply required in Sector 4</span>
          </div>
        </div>

        {/* Card 4: Clean Water */}
        <div className="donezo-kpi-card donezo-kpi-white">
          <div className="donezo-kpi-top">
            <span className="donezo-kpi-label">Potable Water Supply</span>
            <button className="donezo-kpi-arrow-outline">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
          <div className="donezo-kpi-number text-slate-900">8,400 L</div>
          <div className="donezo-kpi-status-text">
            <span>12 Water Points Active</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="donezo-filter-toolbar">
        {/* Search Box */}
        <div className="donezo-search-box">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resource name, shelter, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="donezo-filter-pills-row">
          {['ALL', 'SHELTER', 'MEDICAL', 'WATER', 'FOOD', 'EQUIPMENT'].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`donezo-filter-pill-btn ${categoryFilter === c ? 'active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Status Filter Pills */}
        <div className="donezo-filter-pills-row">
          {['ALL', 'AVAILABLE', 'LOW_STOCK'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`donezo-filter-pill-btn ${statusFilter === s ? 'active-dark' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="donezo-cards-grid-3">
        {filteredResources.map((res) => {
          const pct = Math.round((res.available / res.total) * 100);

          return (
            <div
              key={res.id}
              className="donezo-incident-card"
              onClick={() => setSelectedResource(res)}
            >
              {/* Top Header */}
              <div className="donezo-incident-card-top">
                <div>
                  <span className="donezo-incident-code">{res.id}</span>
                  <h4 className="donezo-incident-title">{res.name}</h4>
                  <div className="donezo-incident-location">
                    <MapPin className="w-3.5 h-3.5 donezo-location-icon" />
                    <span>{res.location}</span>
                  </div>
                </div>

                <span className={`donezo-badge-priority ${getCategoryBadgeClass(res.category)}`}>
                  {res.category}
                </span>
              </div>

              {/* Stock / Capacity Bar & Metrics */}
              <div className="donezo-capacity-section">
                <div className="donezo-capacity-header">
                  <span>Available Capacity</span>
                  <span className="donezo-capacity-val">
                    {res.available} / {res.total} {res.unit} ({pct}%)
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="donezo-capacity-track">
                  <div
                    className="donezo-capacity-fill"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pct < 30 ? '#DC2626' : pct < 60 ? '#D97706' : 'var(--donezo-forest)',
                    }}
                  />
                </div>
              </div>

              {/* Freshness Timestamp */}
              <div className="donezo-freshness-row">
                <Clock className="w-3 h-3" />
                <span>{res.freshness}</span>
              </div>

              {/* Card Footer & Allocate Button */}
              <div className="donezo-incident-footer">
                <span
                  className={`donezo-badge-status ${
                    res.status === 'AVAILABLE' ? 'status-resolved' : 'status-active'
                  }`}
                >
                  ● {res.status === 'AVAILABLE' ? 'In Stock' : 'Low Stock'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedResource(res);
                    setModalType('allocate');
                  }}
                  className="donezo-btn-dossier"
                >
                  Allocate Stock
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donezo Styled Modals */}
      {(selectedResource || modalType) && (
        <div
          className="donezo-modal-overlay"
          onClick={() => {
            setSelectedResource(null);
            setModalType(null);
          }}
        >
          <div
            className="donezo-modal-card"
            style={{ maxWidth: '540px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal 1: Register Resource Depot */}
            {modalType === 'addResource' ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <span className="text-xs font-mono text-slate-400">INVENTORY REGISTRATION</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">Register Resource Depot</h3>
                  </div>
                  <button
                    onClick={() => setModalType(null)}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddResource} className="space-y-3.5 mb-5" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div className="donezo-form-group">
                    <label className="donezo-form-label">Resource / Depot Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kelani Emergency Medical Hub 3"
                      value={newResName}
                      onChange={(e) => setNewResName(e.target.value)}
                      className="donezo-form-input"
                    />
                  </div>

                  <div className="donezo-form-group">
                    <label className="donezo-form-label">Resource Category</label>
                    <select
                      value={newResCategory}
                      onChange={(e) => setNewResCategory(e.target.value)}
                      className="donezo-form-input"
                    >
                      <option value="SHELTER">Shelter Facilities</option>
                      <option value="MEDICAL">Medical & Trauma Supplies</option>
                      <option value="WATER">Potable Drinking Water</option>
                      <option value="FOOD">Dry Food Rations</option>
                      <option value="EQUIPMENT">Power & Extraction Equipment</option>
                    </select>
                  </div>

                  <div className="donezo-form-group">
                    <label className="donezo-form-label">Depot Physical Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Pettah Municipal Complex, Colombo 11"
                      value={newResLocation}
                      onChange={(e) => setNewResLocation(e.target.value)}
                      className="donezo-form-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="donezo-form-group">
                      <label className="donezo-form-label">Total Stock Capacity</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 500"
                        value={newResTotal}
                        onChange={(e) => setNewResTotal(e.target.value)}
                        className="donezo-form-input"
                      />
                    </div>
                    <div className="donezo-form-group">
                      <label className="donezo-form-label">Unit of Measure</label>
                      <input
                        type="text"
                        placeholder="e.g. Beds, Liters, Kits"
                        value={newResUnit}
                        onChange={(e) => setNewResUnit(e.target.value)}
                        className="donezo-form-input"
                      />
                    </div>
                  </div>

                  <div className="donezo-form-group">
                    <label className="donezo-form-label">Depot Officer / Contact</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Alexandra Deff (Lead Medical Responder)"
                      value={newResContact}
                      onChange={(e) => setNewResContact(e.target.value)}
                      className="donezo-form-input"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className="donezo-btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="donezo-btn-primary"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Save & Broadcast Depot</span>
                    </button>
                  </div>
                </form>
              </>
            ) : modalType === 'allocate' && selectedResource ? (
              /* Modal 2: Allocate Stock */
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <span className="text-xs font-mono text-slate-400">STOCK DISPATCH</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">Allocate {selectedResource.name}</h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedResource(null);
                      setModalType(null);
                    }}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3.5 mb-5" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-medium block">Available In Stock</span>
                      <span className="font-mono text-sm font-bold text-emerald-800 mt-0.5 block">
                        {selectedResource.available} / {selectedResource.total} {selectedResource.unit}
                      </span>
                    </div>
                    <span className={`donezo-badge-priority ${getCategoryBadgeClass(selectedResource.category)}`}>
                      {selectedResource.category}
                    </span>
                  </div>

                  <div className="donezo-form-group">
                    <label className="donezo-form-label">Destination Disaster Sector / Camp</label>
                    <select
                      value={allocateSector}
                      onChange={(e) => setAllocateSector(e.target.value)}
                      className="donezo-form-input"
                    >
                      <option>Sector 4 (Kelani Flood Basin Relief Camp)</option>
                      <option>Sector 2 (Grandpass Structural Collapse Zone)</option>
                      <option>Pettah Municipal Evacuation Shelter Alpha</option>
                      <option>Borella Cross Road First-Aid Post</option>
                    </select>
                  </div>

                  <div className="donezo-form-group">
                    <label className="donezo-form-label">Quantity to Dispatch ({selectedResource.unit})</label>
                    <input
                      type="number"
                      max={selectedResource.available}
                      placeholder={`Max available: ${selectedResource.available}`}
                      value={allocateQty}
                      onChange={(e) => setAllocateQty(e.target.value)}
                      className="donezo-form-input"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedResource(null);
                      setModalType(null);
                    }}
                    className="donezo-btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAllocateStock}
                    className="donezo-btn-primary"
                  >
                    <Package className="w-4 h-4" />
                    <span>Confirm Stock Dispatch</span>
                  </button>
                </div>
              </>
            ) : selectedResource ? (
              /* Modal 3: Resource Inspector Details */
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <span className="donezo-chip-id mb-1">#{selectedResource.id}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedResource.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`donezo-badge-priority ${getCategoryBadgeClass(selectedResource.category)}`}>
                      {selectedResource.category}
                    </span>
                    <button
                      onClick={() => setSelectedResource(null)}
                      className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-5 text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-xs font-semibold block">DEPOT LOCATION</span>
                      <span className="font-bold text-slate-800 text-xs mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        {selectedResource.location}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-xs font-semibold block">AVAILABLE INVENTORY</span>
                      <span className="font-mono font-bold text-emerald-800 text-sm mt-0.5 block">
                        {selectedResource.available} / {selectedResource.total} {selectedResource.unit}
                      </span>
                    </div>
                    <span className={`donezo-badge-status ${selectedResource.available / selectedResource.total < 0.3 ? 'status-active' : 'status-resolved'}`}>
                      ● {selectedResource.available / selectedResource.total < 0.3 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-xs font-semibold block">DEPOT CONTACT</span>
                      <span className="font-bold text-slate-800 text-xs mt-0.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {selectedResource.contactPerson}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-xs font-semibold block mb-1">DESCRIPTION & INVENTORY NOTE</span>
                    <p className="text-slate-700 text-xs leading-relaxed">{selectedResource.description}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="donezo-btn-outline"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setModalType('allocate')}
                    className="donezo-btn-primary"
                  >
                    <Package className="w-4 h-4" />
                    <span>Dispatch Stock Allocation</span>
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
