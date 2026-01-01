import React, { useState, useEffect } from 'react';
import { getReadingForDay, getDayOfYear, getDateForDay } from './services/biblePlan';
import { DailyReadingPlan } from './types';
import LinkOverlay from './components/LinkOverlay';

const App: React.FC = () => {
  const [currentDay, setCurrentDay] = useState<number>(getDayOfYear());
  const [plan, setPlan] = useState<DailyReadingPlan | null>(null);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
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

  const selectedDayDate = getDateForDay(currentDay);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans pb-24 ${isDarkMode ? 'bg-[#121212] text-slate-100' : 'bg-[#FDFCF8] text-slate-900'}`}>
      <header className={`pt-12 pb-6 px-6 sticky top-0 z-40 shadow-sm border-b transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A] border-slate-800 shadow-black/20' : 'bg-white border-slate-100'}`}>
        <div className="max-w-lg mx-auto flex justify-between items-end mb-4">
          <div>
            <h1 className={`text-sm font-bold tracking-[0.3em] uppercase mb-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {selectedDayDate}
            </h1>
            <h2 className={`text-4xl font-serif font-black leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button 
              onClick={() => setShowSelector(!showSelector)}
              className={`p-2 rounded-full transition-all ${showSelector ? (isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white') : (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-400')}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button 
              onClick={goToToday}
              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full active:scale-95 transition-all ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-400'}`}
            >
              Today
            </button>
          </div>
        </div>

        {showSelector && (
          <div className={`max-w-lg mx-auto mt-4 p-4 rounded-2xl border flex flex-col gap-4 ${isDarkMode ? 'bg-[#252525] border-slate-700 shadow-lg' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest ml-1">Jump to Date</label>
              <input type="date" onChange={handleDateChange} className={`w-full p-3 rounded-xl border text-sm outline-none ${isDarkMode ? 'bg-[#1A1A1A] border-slate-600 text-white' : 'bg-white border-slate-200'}`} />
            </div>
          </div>
        )}
      </header>

      <main className="max-w-lg mx-auto p-4 pt-8">
        <div className="space-y-4">
          {plan?.readings.map((reading, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveUrl(reading.link)}
              className={`rounded-3xl p-6 border active:scale-[0.98] transition-all cursor-pointer ${isDarkMode ? 'bg-[#1A1A1A] border-slate-800' : 'bg-white border-slate-100'}`}
            >
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-indigo-400">{reading.category}</span>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold">{reading.reference}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md shadow-2xl rounded-full border flex items-center justify-between p-2 z-40 ${isDarkMode ? 'bg-[#1A1A1A]/90 backdrop-blur-md border-slate-800' : 'bg-white/90 backdrop-blur-md border-slate-100'}`}>
          <button onClick={goToPrev} className="p-4"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
          <div className="text-xs font-bold uppercase tracking-widest">{plan?.label}</div>
          <button onClick={goToNext} className="p-4"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
        </div>
      </main>

      {activeUrl && <LinkOverlay url={activeUrl} onClose={() => setActiveUrl(null)} isDarkMode={isDarkMode} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700;900&display=swap');
        body { font-family: 'Crimson Pro', serif; }
      `}</style>
    </div>
  );
};

export default App;
