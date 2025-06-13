import React, { useState } from 'react';
import { Statistics } from '../utils/calculations';

interface StatisticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ isOpen, onClose }) => {
  const [values, setValues] = useState<string>('');
  const [results, setResults] = useState<{
    mean?: number;
    median?: number;
    stdDev?: number;
    variance?: number;
    min?: number;
    max?: number;
  }>({});

  const handleCalculate = () => {
    try {
      const numArray = values
        .split(',')
        .map(v => v.trim())
        .filter(v => v !== '')
        .map(v => parseFloat(v));

      if (numArray.some(n => isNaN(n))) {
        alert('Please enter valid numbers separated by commas');
        return;
      }

      if (numArray.length === 0) {
        alert('Please enter at least one number');
        return;
      }

      setResults({
        mean: Statistics.mean(numArray),
        median: Statistics.median(numArray),
        stdDev: Statistics.standardDeviation(numArray),
        variance: Statistics.variance(numArray),
        min: Statistics.min(numArray),
        max: Statistics.max(numArray),
      });
    } catch (error) {
      alert('Error calculating statistics: ' + (error as Error).message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 w-96 max-w-90vw max-h-80vh overflow-y-auto border border-gray-700/50 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Statistics Calculator</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Enter values (comma-separated)
            </label>
            <textarea
              value={values}
              onChange={(e) => setValues(e.target.value)}
              className="w-full bg-gray-800/90 text-white rounded-lg px-3 py-2 h-24 resize-none border border-gray-600/50 focus:border-orange-500/50 focus:outline-none transition-colors"
              placeholder="1, 2, 3, 4, 5"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600/90 hover:bg-blue-500/90 text-white py-2 rounded-lg transition-colors font-medium shadow-lg"
          >
            Calculate Statistics
          </button>

          {Object.keys(results).length > 0 && (
            <div className="bg-gray-800/90 rounded-lg p-4 space-y-2 border border-gray-600/50">
              <h3 className="text-white font-semibold mb-2">Results:</h3>
              {results.mean !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">Mean:</span>
                  <span className="text-white font-mono">{results.mean.toFixed(4)}</span>
                </div>
              )}
              {results.median !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">Median:</span>
                  <span className="text-white font-mono">{results.median.toFixed(4)}</span>
                </div>
              )}
              {results.stdDev !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">Std. Deviation:</span>
                  <span className="text-white font-mono">{results.stdDev.toFixed(4)}</span>
                </div>
              )}
              {results.variance !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">Variance:</span>
                  <span className="text-white font-mono">{results.variance.toFixed(4)}</span>
                </div>
              )}
              {results.min !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">Minimum:</span>
                  <span className="text-white font-mono">{results.min.toFixed(4)}</span>
                </div>
              )}
              {results.max !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">Maximum:</span>
                  <span className="text-white font-mono">{results.max.toFixed(4)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;