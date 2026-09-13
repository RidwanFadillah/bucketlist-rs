import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Compass, CheckCircle2, Sparkles, MapPin, CalendarCheck } from 'lucide-react';
import { BucketlistCard } from './BucketlistCard';
import { BucketlistModal } from './BucketlistModal';
import { BucketlistDetailModal } from './BucketlistDetailModal';
import { useToast } from '../Common/Toast';

const CATEGORIES = [
  'Semua Kategori',
  'Nonton Film & Date 🎬',
  'Pantai & Laut 🏖️',
  'Gunung & Alam 🌲',
  'Kota & Budaya 🏛️',
  'Kuliner & Jajan 🍜',
  'Staycation & Relaksasi 🏨',
  'Internasional & Luar Negeri ✈️'
];

export const BucketlistTab = ({
  bucketlist,
  onCreateBucketlist,
  onUpdateBucketlist,
  onDeleteBucketlist
}) => {
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);


  // Filtered bucketlist items
  const filteredItems = useMemo(() => {
    return bucketlist.filter(item => {
      const matchSearch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'Semua Kategori' || item.category === selectedCategory;
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [bucketlist, searchQuery, selectedCategory, statusFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = bucketlist.length;
    const wishlist = bucketlist.filter(b => b.status === 'wishlist').length;
    const planned = bucketlist.filter(b => b.status === 'planned').length;
    const visited = bucketlist.filter(b => b.status === 'visited').length;
    const totalEstimated = bucketlist.reduce((sum, b) => sum + (Number(b.estimatedBudget) || 0), 0);
    return { total, wishlist, planned, visited, totalEstimated };
  }, [bucketlist]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setDetailItem(null);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await onUpdateBucketlist(editingItem.id, formData);
        addToast('Destinasi berhasil diperbarui!', 'success');
      } else {
        await onCreateBucketlist(formData);
        addToast('Destinasi impian baru berhasil ditambahkan!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan destinasi', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus destinasi impian ini?')) {
      try {
        await onDeleteBucketlist(id);
        setDetailItem(null);
        addToast('Destinasi telah dihapus.', 'info');
      } catch (err) {
        addToast('Gagal menghapus destinasi', 'error');
      }
    }
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      await onUpdateBucketlist(id, { status: newStatus });
      addToast(`Status diubah menjadi: ${newStatus === 'visited' ? 'Tercapai 🎉' : newStatus === 'planned' ? 'Terencana' : 'Impian'}`);
    } catch (err) {
      addToast('Gagal memperbarui status', 'error');
    }
  };

  const handleToggleChecklist = async (bucketlistId, checklistId) => {
    const item = bucketlist.find(b => b.id === bucketlistId);
    if (!item) return;

    const updatedChecklist = (item.checklist || []).map(c =>
      c.id === checklistId ? { ...c, done: !c.done } : c
    );

    await onUpdateBucketlist(bucketlistId, { checklist: updatedChecklist });
    if (detailItem && detailItem.id === bucketlistId) {
      setDetailItem(prev => ({ ...prev, checklist: updatedChecklist }));
    }
  };

  const handleUpdateRating = async (bucketlistId, newRating) => {
    await onUpdateBucketlist(bucketlistId, { rating: newRating });
    if (detailItem && detailItem.id === bucketlistId) {
      setDetailItem(prev => ({ ...prev, rating: newRating }));
    }
    addToast(`Rating ${newRating} bintang tersimpan! ⭐`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Total Impian</p>
            <h4 className="text-xl font-extrabold text-slate-800">{stats.total} Destinasi</h4>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Sudah Terencana</p>
            <h4 className="text-xl font-extrabold text-slate-800">{stats.planned} Trip</h4>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Sudah Tercapai</p>
            <h4 className="text-xl font-extrabold text-slate-800">{stats.visited} Selesai 🎉</h4>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
            Rp
          </div>
          <div className="truncate">
            <p className="text-xs text-slate-400 font-semibold">Estimasi Total Dana</p>
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-800 truncate">
              Rp {(stats.totalEstimated / 1000000).toFixed(1)} Juta
            </h4>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search & Add Button */}
      <div className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari destinasi, kota, kenangan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Add Destination Button */}
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Destinasi Impian</span>
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'wishlist', label: 'Impian' },
              { id: 'planned', label: 'Terencana' },
              { id: 'visited', label: 'Tercapai 🎉' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  statusFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bucketlist Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map(item => (
            <BucketlistCard
              key={item.id}
              item={item}
              onSelect={setDetailItem}
              onQuickStatusChange={handleQuickStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Belum ada destinasi yang sesuai</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            Mulai tuliskan daftar tempat wisata, pulau, atau negara impian yang ingin kalian kunjungi berdua!
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Destinasi Pertama
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      <BucketlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingItem={editingItem}
      />

      {/* Detail Modal */}
      <BucketlistDetailModal
        item={detailItem}
        isOpen={Boolean(detailItem)}
        onClose={() => setDetailItem(null)}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
        onToggleChecklist={handleToggleChecklist}
        onUpdateRating={handleUpdateRating}
      />
    </div>
  );
};
