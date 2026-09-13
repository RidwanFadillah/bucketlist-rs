import React, { useState, useEffect } from 'react';
import { Plane, Sparkles, Clock, Heart, Calendar } from 'lucide-react';

export const CountdownWidget = ({ events = [], bucketlist = [] }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetEvent, setTargetEvent] = useState(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find closest future event (preferably a trip)
    const futureEvents = events
      .filter(ev => ev.startDate && new Date(ev.startDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    if (futureEvents.length > 0) {
      setTargetEvent(futureEvents[0]);
    } else {
      setTargetEvent(null);
    }
  }, [events]);

  useEffect(() => {
    if (!targetEvent || !targetEvent.startDate) return;

    const calculateTime = () => {
      const target = new Date(targetEvent.startDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetEvent]);

  if (!targetEvent) {
    return (
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg">Belum Ada Agenda Perjalanan Mendatang</h3>
            <p className="text-xs text-white/80">
              Tentukan target tanggal destinasi di tab Bucketlist atau Kalender untuk mengaktifkan countdown!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 blur-xl pointer-events-none" />
      <div className="absolute right-20 -top-10 w-32 h-32 rounded-full bg-emerald-400/10 blur-lg pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Info */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-emerald-100">
            <Plane className="w-3.5 h-3.5 animate-bounce" />
            <span>Hitung Mundur Petualangan Berikutnya</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm">
            {targetEvent.title}
          </h2>
          <p className="text-xs text-emerald-100/90 flex items-center gap-2">
            <span>📅 Tanggal: {targetEvent.startDate}</span>
            {targetEvent.notes && <span>• "{targetEvent.notes}"</span>}
          </p>
        </div>

        {/* Right: Live Countdown Digits */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full md:w-auto text-center shrink-0">
          <div className="bg-black/30 backdrop-blur-md border border-white/20 p-2.5 sm:p-3 rounded-2xl min-w-[65px] sm:min-w-[75px]">
            <span className="text-xl sm:text-2xl font-black font-mono block text-white">
              {timeLeft.days}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-200 uppercase tracking-wider">
              Hari
            </span>
          </div>

          <div className="bg-black/30 backdrop-blur-md border border-white/20 p-2.5 sm:p-3 rounded-2xl min-w-[65px] sm:min-w-[75px]">
            <span className="text-xl sm:text-2xl font-black font-mono block text-white">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-200 uppercase tracking-wider">
              Jam
            </span>
          </div>

          <div className="bg-black/30 backdrop-blur-md border border-white/20 p-2.5 sm:p-3 rounded-2xl min-w-[65px] sm:min-w-[75px]">
            <span className="text-xl sm:text-2xl font-black font-mono block text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-200 uppercase tracking-wider">
              Menit
            </span>
          </div>

          <div className="bg-black/30 backdrop-blur-md border border-white/20 p-2.5 sm:p-3 rounded-2xl min-w-[65px] sm:min-w-[75px]">
            <span className="text-xl sm:text-2xl font-black font-mono block text-amber-300">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-200 uppercase tracking-wider">
              Detik
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
