import { useState } from 'react';

interface PeriodSelectorProps {
  onPeriodChange: (period: 'Current' | 'Previous') => void;
  currentPeriod: 'Current' | 'Previous';
}

export const PeriodSelector = ({ onPeriodChange, currentPeriod }: PeriodSelectorProps) => {
  return (
    <button 
      onClick={() => onPeriodChange(currentPeriod === 'Current' ? 'Previous' : 'Current')}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="flex items-center gap-3">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-gray-400 group-hover:text-gray-600" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" 
            clipRule="evenodd" 
          />
        </svg>
        <div className="text-left">
          <div className="text-xs text-gray-500 font-medium">Time Period</div>
          <div className="text-sm font-semibold text-gray-900 flex items-center gap-1">
            {currentPeriod}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 text-gray-400 group-hover:text-gray-600" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
};
