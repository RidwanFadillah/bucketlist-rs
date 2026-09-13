import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Trash2,
  Edit3,
  Sparkles,
  Tag
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO
} from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { CountdownWidget } from './CountdownWidget';
import { EventModal } from './EventModal';
import { useToast } from '../Common/Toast';

export const CalendarTab = ({
  events = [],
  bucketlist = [],
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const { addToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [modalInitialDate, setModalInitialDate] = useState('');

  // Map bucketlist id to title for quick lookup
  const bucketlistMap = useMemo(() => {
    const map = {};
    bucketlist.forEach(b => { map[b.id] = b.title; });
    return map;
  }, [bucketlist]);

  // Calendar dates matrix
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  // Helper to find events on a given day
  const getEventsForDay = (day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return events.filter(ev => {
      if (!ev.startDate) return false;
      const start = ev.startDate;
      const end = ev.endDate || ev.startDate;
      return dayStr >= start && dayStr <= end;
    });
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
  };

  const handleOpenAddOnDate = (day) => {
    setEditingEvent(null);
    setModalInitialDate(format(day, 'yyyy-MM-dd'));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setModalInitialDate(event.startDate || '');
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingEvent) {
        await onUpdateEvent(editingEvent.id, formData);
        addToast('Agenda berhasil diperbarui!', 'success');
      } else {
        await onCreateEvent(formData);
        addToast('Agenda kalender baru berhasil ditambahkan!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan agenda', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus agenda kalender ini?')) {
      try {
        await onDeleteEvent(id);
        addToast('Agenda telah dihapus.', 'info');
      } catch (err) {
        addToast('Gagal menghapus agenda', 'error');
      }
    }
  };

  // Selected date events
  const selectedDateEvents = useMemo(() => {
    return getEventsForDay(selectedDate);
  }, [selectedDate, events]);

  // Sorted upcoming events list
  const upcomingEvents = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return [...events]
      .sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
  }, [events]);

  const weekDayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  return (
    <div className="space-y-6">
      {/* 1. Countdown Widget */}
      <CountdownWidget events={events} bucketlist={bucketlist} />

      {/* 2. Main Calendar & Agenda Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 capitalize">
                {format(currentDate, 'MMMM yyyy', { locale: idLocale })}
              </h2>
              <button
                onClick={handleToday}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Hari Ini
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                title="Bulan Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 py-1 border-b border-slate-100">
            {weekDayNames.map((name, i) => (
              <div key={i} className={i >= 5 ? 'text-rose-400' : ''}>
                {name}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {calendarDays.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              const dayEvents = getEventsForDay(day);

              return (
                <div
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  onDoubleClick={() => handleOpenAddOnDate(day)}
                  className={`min-h-[75px] sm:min-h-[90px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20 shadow-sm'
                      : isCurrentDay
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : isCurrentMonth
                      ? 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                      : 'border-transparent bg-slate-50/40 opacity-40 hover:opacity-70'
                  }`}
                >
                  {/* Top Day Number & Add Button */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isCurrentDay
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : isSelected
                          ? 'bg-rose-600 text-white'
                          : isCurrentMonth
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAddOnDate(day);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-600 rounded-md transition-opacity"
                      title="Tambah agenda pada tanggal ini"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Day Event Chips */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(ev);
                        }}
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white truncate shadow-xs transition-transform hover:scale-102"
                        style={{ backgroundColor: ev.color || '#3B82F6' }}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] font-bold text-slate-500 block text-right">
                        +{dayEvents.length - 2} lagi
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>💡 Klik ganda pada tanggal atau tombol (+) untuk menandai agenda baru</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Hari Ini
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block ml-2" /> Terpilih
            </span>
          </div>
        </div>

        {/* Right 1 Col: Selected Date Events & Upcoming Agenda */}
        <div className="space-y-4">
          {/* Selected Date Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Agenda Tanggal
                </p>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: idLocale })}
                </h3>
              </div>

              <button
                onClick={() => handleOpenAddOnDate(selectedDate)}
                className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                title="Tambah agenda pada tanggal ini"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {selectedDateEvents.length > 0 ? (
              <div className="space-y-2.5">
                {selectedDateEvents.map((ev) => {
                  const linkedDestination = bucketlistMap[ev.bucketlistId];
                  return (
                    <div
                      key={ev.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: ev.color || '#3B82F6' }}
                          />
                          <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                            {ev.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenEdit(ev)}
                            className="p-1 text-slate-400 hover:text-indigo-600"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(ev.id)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {linkedDestination && (
                        <p className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {linkedDestination}
                        </p>
                      )}

                      {ev.notes && (
                        <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-xl border border-slate-100">
                          "{ev.notes}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
                <p>Tidak ada agenda pada tanggal ini</p>
                <button
                  onClick={() => handleOpenAddOnDate(selectedDate)}
                  className="mt-2 text-rose-600 font-bold hover:underline inline-block"
                >
                  + Tambah Agenda
                </button>
              </div>
            )}
          </div>

          {/* All Upcoming Events Stream */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-600" />
              Semua Jadwal & Milestone ({upcomingEvents.length})
            </h3>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => handleOpenEdit(ev)}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: ev.color || '#3B82F6' }}
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-700 truncate">{ev.title}</p>
                      <p className="text-[10px] text-slate-400">
                        {ev.startDate} {ev.endDate && ev.endDate !== ev.startDate ? `s/d ${ev.endDate}` : ''}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize shrink-0">
                    {ev.type || 'trip'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingEvent={editingEvent}
        bucketlist={bucketlist}
        initialDate={modalInitialDate}
      />
    </div>
  );
};
