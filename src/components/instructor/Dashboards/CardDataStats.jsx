import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'; 

const CardDataStats = ({ title, total, rate, levelUp, levelDown, children }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {total}
          </h4>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1 text-sm font-medium">
          <span
            className={`flex items-center gap-1 ${
              levelUp ? 'text-green-500' : levelDown ? 'text-red-500' : 'text-gray-600'
            }`}
          >
            {rate}
            
            {levelUp && (
              <ArrowUpIcon className={`h-5 w-5 ${levelUp ? 'text-green-500' : 'text-gray-400'}`} />
            )}
            {levelDown && (
              <ArrowDownIcon className={`h-5 w-5 ${levelDown ? 'text-red-500' : 'text-gray-400'}`} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
