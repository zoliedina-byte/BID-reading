import React, { useState, useEffect, useRef } from 'react';
import { getReadingForDay, getDayOfYear, getDateForDay } from './services/biblePlan';
import { DailyReadingPlan } from './types';
import PassageCard from './components/PassageCard';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const App: React.FC = () => {
  const [currentDay, setCurrentDay] = useState<number>(getDayOfYear());
  const [plan, setPlan] = useState<DailyReadingPlan | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  
  // State for the visual calendar picker
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const hours = new Date().getHours();
    return hours < 7 || hours > 19;
  });

  useEffect(() => {
    setPlan(getReadingForDay(currentDay));
    
    // Sync the calendar picker month with the current selected day
    // We reverse engineer the month from the day number
    const date = new Date(2026, 0, currentDay); // 2026 is our non-leap reference year
    setSelectedMonthIndex(date.getMonth());
  }, [currentDay]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const goToPrev = () => setCurrentDay(prev => Math.max(1, prev - 1));
  const goToNext = () => setCurrentDay(prev => Math.min(365, prev + 1));
  
  const goToToday = () => {
    const today = getDayOfYear();
    setCurrentDay(today);
    setSelectedMonthIndex(new Date().getMonth());
    setShowSelector(false);
  };

  const handleDayClick = (dayOfMonth: number) => {
    // Calculate day of year based on 2026 (non-leap)
    const date = new Date(2026, selectedMonthIndex, dayOfMonth);
    const dayOfYear = getDayOfYear(date);
    setCurrentDay(dayOfYear);
    setShowSelector(false);
  };

  // Uses _blank to reliably open external sites like BibleGateway that block iframes.
  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  const selectedDayDate = getDateForDay(currentDay);

  // Determine current day in month for highlighting
  const currentDateObj = new Date(2026, 0, currentDay);
  const activeDayInMonth = currentDateObj.getMonth() === selectedMonthIndex ? currentDateObj.getDate() : -1;

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans pb-32 ${isDarkMode ? 'bg-[#121212] text-slate-100' : 'bg-[#FDFCF8] text-slate-900'}`}>
      
      {/* Header */}
      <header className={`pt-12 pb-4 px-6 sticky top-0 z-40 shadow-sm border-b transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A] border-slate-800 shadow-black/20' : 'bg-white border-slate-100'}`}>
        <div className="max-w-lg mx-auto flex justify-between items-end mb-4">
          <div 
            onClick={() => setShowSelector(!showSelector)} 
            className="cursor-pointer active:opacity-60 transition-opacity"
          >
            <h1 className={`text-xs font-bold tracking-[0.2em] uppercase mb-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {selectedDayDate}
            </h1>
            <h2 className={`text-3xl font-serif font-black leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {plan?.label} <span className="text-sm align-middle opacity-40 ml-1">▼</span>
            </h2>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-50 text-slate-400'}`}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={() => setShowSelector(!showSelector)}
              className={`p-2 rounded-full transition-all ${showSelector ? (isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white') : (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-400')}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {showSelector && (
          <div className={`max-w-lg mx-auto mt-4 p-4 rounded-xl border flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300 ${isDarkMode ? 'bg-[#252525] border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
            
            <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Select Date</span>
                <button 
                  onClick={goToToday}
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${isDarkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}
                >
                  Go to Today
                </button>
            </div>

            {/* Custom Visual Calendar */}
            <div className="flex flex-col gap-4 select-none">
              
              {/* Month Scroller */}
              <div className="flex overflow-x-auto gap-2 pb-2 -mx-2 px-2 scrollbar-hide snap-x">
                {MONTHS.map((m, idx) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMonthIndex(idx)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-colors snap-center ${
                      selectedMonthIndex === idx 
                        ? (isDarkMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200')
                        : (isDarkMode ? 'bg-[#333] text-slate-400 hover:bg-[#444]' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50')
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: DAYS_IN_MONTH[selectedMonthIndex] }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all active:scale-90 ${
                      activeDayInMonth === day
                        ? (isDarkMode ? 'bg-indigo-500 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#252525]' : 'bg-indigo-600 text-white ring-2 ring-indigo-500 ring-offset-2')
                        : (isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100')
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Day Input (Bottom Fallback) */}
            <div className={`mt-2 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
               <div className="flex items-center gap-3">
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap">Or Day #</span>
                 <input 
                    type="number" 
                    min="1" 
                    max="365" 
                    value={currentDay}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1 && val <= 365) setCurrentDay(val);
                    }}
                    className={`w-full p-2 rounded-lg border text-sm text-center outline-none ${isDarkMode ? 'bg-[#1A1A1A] border-slate-600 text-white' : 'bg-white border-slate-200'}`} 
                 />
               </div>
            </div>

          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto p-4 pt-6">
        <div className="space-y-4">
          {plan?.readings.map((reading, idx) => (
            <PassageCard 
              key={idx} 
              reading={reading} 
              onOpen={openLink} 
            />
          ))}
          
          {(!plan || plan.readings.length === 0) && (
             <div className="p-8 text-center opacity-50">
                <p>No readings available for this date.</p>
             </div>
          )}
        </div>

        {/* Floating Controls */}
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm shadow-xl rounded-full border flex items-center justify-between p-1 z-40 ${isDarkMode ? 'bg-[#1A1A1A]/95 backdrop-blur-md border-slate-800' : 'bg-white/95 backdrop-blur-md border-slate-200'}`}>
          <button onClick={goToPrev} className={`p-4 rounded-full active:scale-90 transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="text-xs font-bold uppercase tracking-widest pointer-events-none select-none opacity-80">{plan?.label}</div>
          <button onClick={goToNext} className={`p-4 rounded-full active:scale-90 transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700;900&display=swap');
        body { font-family: 'Crimson Pro', serif; }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
