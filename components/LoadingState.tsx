
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 space-y-6 animate-fade-in">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-800">Curating Today's Passages</h2>
        <p className="text-slate-500 mt-2">Connecting with the world of wisdom...</p>
      </div>
    </div>
  );
};

export default LoadingState;
