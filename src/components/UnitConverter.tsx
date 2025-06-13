import React, { useState } from 'react';
import { UNIT_CONVERSIONS } from '../utils/constants';

interface UnitConverterProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnitConverter: React.FC<UnitConverterProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<keyof typeof UNIT_CONVERSIONS>('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const handleConvert = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    if (category === 'temperature') {
      const tempConversions = UNIT_CONVERSIONS.temperature;
      let celsius: number;
      
      // Convert to Celsius first
      if (fromUnit === 'celsius') celsius = numValue;
      else if (fromUnit === 'fahrenheit') celsius = (numValue - 32) * 5/9;
      else celsius = numValue - 273.15; // kelvin
      
      // Convert from Celsius to target
      let convertedValue: number;
      if (toUnit === 'celsius') convertedValue = celsius;
      else if (toUnit === 'fahrenheit') convertedValue = tempConversions.fahrenheit(celsius);
      else convertedValue = tempConversions.kelvin(celsius);
      
      setResult(convertedValue.toFixed(4));
    } else {
      const conversions = UNIT_CONVERSIONS[category] as Record<string, number>;
      const fromFactor = conversions[fromUnit];
      const toFactor = conversions[toUnit];
      const convertedValue = (numValue / fromFactor) * toFactor;
      setResult(convertedValue.toFixed(4));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 w-96 max-w-90vw border border-gray-700/50 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Unit Converter</h2>
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
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                const newCategory = e.target.value as keyof typeof UNIT_CONVERSIONS;
                setCategory(newCategory);
                const units = Object.keys(UNIT_CONVERSIONS[newCategory]);
                setFromUnit(units[0]);
                setToUnit(units[1] || units[0]);
              }}
              className="w-full bg-gray-800/90 text-white rounded-lg px-3 py-2 border border-gray-600/50 focus:border-orange-500/50 focus:outline-none transition-colors"
            >
              {Object.keys(UNIT_CONVERSIONS).map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                From
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-gray-800/90 text-white rounded-lg px-3 py-2 border border-gray-600/50 focus:border-orange-500/50 focus:outline-none transition-colors"
              >
                {Object.keys(UNIT_CONVERSIONS[category]).map(unit => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                To
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-gray-800/90 text-white rounded-lg px-3 py-2 border border-gray-600/50 focus:border-orange-500/50 focus:outline-none transition-colors"
              >
                {Object.keys(UNIT_CONVERSIONS[category]).map(unit => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Value
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-gray-800/90 text-white rounded-lg px-3 py-2 border border-gray-600/50 focus:border-orange-500/50 focus:outline-none transition-colors"
              placeholder="Enter value to convert"
            />
          </div>

          <button
            onClick={handleConvert}
            className="w-full bg-orange-600/90 hover:bg-orange-500/90 text-white py-2 rounded-lg transition-colors font-medium shadow-lg"
          >
            Convert
          </button>

          {result && (
            <div className="bg-gray-800/90 rounded-lg p-3 border border-gray-600/50">
              <div className="text-gray-300 text-sm font-medium">Result:</div>
              <div className="text-white text-lg font-mono">{result} {toUnit}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;