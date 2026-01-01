import React, { useState, useEffect } from 'react';
import { getReadingForDay, getDayOfYear, getDateForDay } from './services/biblePlan';
import { DailyReadingPlan } from './types';
import PassageCard from './components/PassageCard';

const App: React.FC = () => {
  const [currentDay, setCurrentDay] = useState<number>(getDayOfYear());
  const [plan, setPlan] = useState<DailyReadingPlan | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const hours = new Date().getHours();
    return hours < 7 || hours > 19;
  });

  useEffect(() => {
    setPlan(getReadingForDay(currentDay));
  }, [currentDay]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const goToPrev = () => setCurrentDay(prev => Math.max(1, prev - 1));
  const goToNext = () => setCurrentDay(prev => Math.min(365, prev + 1));
  const goToToday = () => {
    setCurrentDay(getDayOfYear());
    setShowSelector(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    if (!isNaN(selectedDate.getTime())) {
      setCurrentDay(getDayOfYear(selectedDate));
      setShowSelector(false);
    }
  };

  const handleDayNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = parseInt(e.target.value);
    if (!isNaN(day) && day >= 1 && day <= 365) {
      setCurrentDay(day);
      // We do not auto-close here so the user can finish typing numbers like "145"
    }
  };

  // Uses _blank to reliably open external sites like BibleGateway that block iframes.
  // This is the safest method for Android PWAs.
  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  const selectedDayDate = getDateForDay(currentDay);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans pb-32 ${isDarkMode ? 'bg-[#121212] text-slate-100' : 'bg-[#FDFCF8] text-slate-900'}`}>
      
      {/* Header */}
      <header className={`pt-12 pb-4 px-6 sticky top-0 z-40 shadow-sm border-b transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A] border-slate-800 shadow-black/20' : 'bg-white border-slate-100'}`}>
        <div className="max-w-lg mx-auto flex justify-between items-end mb-4">
          <div>
            <h1 className={`text-xs font-bold tracking-[0.2em] uppercase mb-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {selectedDayDate}
            </h1>
            <h2 className={`text-3xl font-serif font-black leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {plan?.label}
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
            
            {/* Date Selection */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Select Date</label>
                <button 
                  onClick={goToToday}
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${isDarkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}
                >
                  Go to Today
                </button>
              </div>
              <input type="date" onChange={handleDateChange} className={`w-full p-3 rounded-lg border text-sm outline-none appearance-none ${isDarkMode ? 'bg-[#1A1A1A] border-slate-600 text-white' : 'bg-white border-slate-200'}`} />
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
                <div className={`flex-grow border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}></div>
                <span className="flex-shrink-0 mx-4 text-[10px] font-bold uppercase tracking-widest opacity-40">OR</span>
                <div className={`flex-grow border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}></div>
            </div>

            {/* Day Number Selection */}
            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Enter Day Number (1-365)</label>
               <input 
                  type="number" 
                  min="1" 
                  max="365" 
                  placeholder={currentDay.toString()} 
                  onChange={handleDayNumberChange} 
                  className={`w-full p-3 rounded-lg border text-sm outline-none appearance-none ${isDarkMode ? 'bg-[#1A1A1A] border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-200 placeholder-slate-400'}`} 
               />
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
      `}</style>
    </div>
  );
};

export default App;
