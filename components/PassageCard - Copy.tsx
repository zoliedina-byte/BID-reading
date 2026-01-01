
import React from 'react';
import { BibleReading } from '../types';

interface PassageCardProps {
  reading: BibleReading;
  onOpen: (url: string) => void;
}

const PassageCard: React.FC<PassageCardProps> = ({ reading, onOpen }) => {
  return (
    <div 
      onClick={() => onOpen(reading.link)}
      className="bg-white rounded-3xl p-6 mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 active:scale-[0.98] transition-all group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-400 bg-indigo-50/50 px-2 py-1 rounded-md">
          {reading.category}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-serif font-semibold text-slate-800">
          {reading.reference}
        </h3>
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2 font-medium">Tap to read on Bible Gateway (RSVCE)</p>
    </div>
  );
};

export default PassageCard;
