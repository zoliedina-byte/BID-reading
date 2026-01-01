
import React, { useState } from 'react';

interface LinkOverlayProps {
  url: string;
  onClose: () => void;
  isDarkMode?: boolean;
}

const LinkOverlay: React.FC<LinkOverlayProps> = ({ url, onClose, isDarkMode = false }) => {
  // Zoom levels: 1 (100%), 1.25 (125%), 1.5 (150%)
  const [zoomLevel, setZoomLevel] = useState(1);

  const cycleZoom = () => {
    if (zoomLevel === 1) setZoomLevel(1.25);
    else if (zoomLevel === 1.25) setZoomLevel(1.5);
    else setZoomLevel(1);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col animate-slide-up h-full overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#121212]' : 'bg-white'}`}>
      {/* App Bar for In-App Browser */}
      <div className={`flex items-center gap-2 p-4 border-b shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1A1A] border-slate-800' : 'bg-white border-slate-100'}`}>
        <button 
          onClick={onClose}
          className={`p-2 -m-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-400 active:bg-slate-800' : 'text-slate-600 active:bg-slate-100'}`}
          aria-label="Close link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex-1 min-w-0 ml-2">
          <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Reading Scripture</p>
          <p className={`text-[10px] truncate font-mono ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{url}</p>
        </div>

        <div className="flex items-center gap-1">
          {/* Zoom Toggle */}
          <button 
            onClick={cycleZoom}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all active:scale-90 ${isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-slate-50 text-indigo-600'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            {Math.round(zoomLevel * 100)}%
          </button>

          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-400 active:bg-slate-800' : 'text-slate-600 active:bg-slate-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Iframe Container with Zoom/Scale Logic */}
      <div className={`flex-1 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#121212]' : 'bg-slate-50'}`}>
        <div 
          className="w-full h-full transition-transform duration-300 ease-out origin-top-left"
          style={{ 
            width: `${100 / zoomLevel}%`, 
            height: `${100 / zoomLevel}%`, 
            transform: `scale(${zoomLevel})` 
          }}
        >
          <iframe 
            src={url} 
            className={`w-full h-full border-none transition-all duration-700 ${isDarkMode ? 'opacity-80' : 'opacity-100'}`}
            style={isDarkMode ? { filter: 'invert(0.9) hue-rotate(180deg)' } : {}}
            title="In-app browser content"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
        
        {/* Overlay helper for info */}
        <div className={`absolute inset-x-0 bottom-0 p-4 pointer-events-none bg-gradient-to-t ${isDarkMode ? 'from-[#121212]' : 'from-white/50'}`}>
          <div className={`p-3 rounded-xl border shadow-lg pointer-events-auto transition-colors duration-500 max-w-[200px] ml-auto ${isDarkMode ? 'bg-[#1A1A1A] border-slate-700' : 'bg-white/90 backdrop-blur-sm border-slate-200'}`}>
            <p className={`text-[10px] leading-tight ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>
              Using RSVCE on Bible Gateway. Use the toggle above to zoom.
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default LinkOverlay;
