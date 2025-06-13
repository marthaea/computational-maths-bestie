import React from 'react';

interface DisplayProps {
  value: string;
  memory: number;
  history: string[];
}

const Display: React.FC<DisplayProps> = ({ value, memory, history }) => {
  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-2xl border border-gray-700/50">
      {/* Memory Indicator */}
      {memory !== 0 && (
        <div className="text-amber-400 text-sm mb-2 flex items-center font-medium">
          <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></span>
          Memory: {memory}
        </div>
      )}
      
      {/* History */}
      {history.length > 0 && (
        <div className="text-gray-400 text-sm mb-2 max-h-20 overflow-y-auto font-mono">
          {history.slice(-3).map((entry, index) => (
            <div key={index} className="truncate">
              {entry}
            </div>
          ))}
        </div>
      )}
      
      {/* Main Display */}
      <div className="text-right">
        <div className="text-white text-4xl font-mono font-light break-all">
          {value || '0'}
        </div>
      </div>
    </div>
  );
};

export default Display;