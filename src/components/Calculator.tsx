import React, { useState, useEffect, useCallback } from 'react';
import { Calculator as CalcEngine, formatNumber } from '../utils/calculations';
import { MATHEMATICAL_CONSTANTS } from '../utils/constants';
import { CalculatorState } from '../types/calculator';
import Display from './Display';
import Button from './Button';
import UnitConverter from './UnitConverter';
import StatisticsPanel from './StatisticsPanel';
import { 
  Calculator as CalcIcon, 
  RotateCcw, 
  Menu, 
  TrendingUp, 
  Shuffle,
  Heart
} from 'lucide-react';

const Calculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForOperand: false,
    memory: 0,
    history: [],
    isAdvancedMode: false,
  });

  const [showUnitConverter, setShowUnitConverter] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('rad');

  const calculate = useCallback((firstOperand: number, secondOperand: number, operation: string): number => {
    switch (operation) {
      case '+': return CalcEngine.add(firstOperand, secondOperand);
      case '-': return CalcEngine.subtract(firstOperand, secondOperand);
      case '*': return CalcEngine.multiply(firstOperand, secondOperand);
      case '/': return CalcEngine.divide(firstOperand, secondOperand);
      case '^': return CalcEngine.power(firstOperand, secondOperand);
      case 'mod': return firstOperand % secondOperand;
      default: return secondOperand;
    }
  }, []);

  const inputNumber = useCallback((num: string) => {
    setState(prevState => {
      if (prevState.waitingForOperand) {
        return {
          ...prevState,
          display: num,
          waitingForOperand: false,
        };
      }

      const newDisplay = prevState.display === '0' ? num : prevState.display + num;
      return {
        ...prevState,
        display: newDisplay,
      };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState(prevState => {
      if (prevState.waitingForOperand) {
        return {
          ...prevState,
          display: '0.',
          waitingForOperand: false,
        };
      }

      if (prevState.display.indexOf('.') === -1) {
        return {
          ...prevState,
          display: prevState.display + '.',
        };
      }

      return prevState;
    });
  }, []);

  const clear = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: '0',
      previousValue: null,
      operation: null,
      waitingForOperand: false,
    }));
  }, []);

  const performOperation = useCallback((nextOperation: string) => {
    setState(prevState => {
      const inputValue = parseFloat(prevState.display);

      if (prevState.previousValue === null) {
        return {
          ...prevState,
          previousValue: inputValue,
          operation: nextOperation,
          waitingForOperand: true,
        };
      }

      if (prevState.operation) {
        const currentValue = prevState.previousValue || 0;
        try {
          const result = calculate(currentValue, inputValue, prevState.operation);
          const resultStr = formatNumber(result);
          const historyEntry = `${currentValue} ${prevState.operation} ${inputValue} = ${result}`;

          return {
            ...prevState,
            display: resultStr,
            previousValue: result,
            operation: nextOperation,
            waitingForOperand: true,
            history: [...prevState.history, historyEntry].slice(-10),
          };
        } catch (error) {
          return {
            ...prevState,
            display: 'Error',
            previousValue: null,
            operation: null,
            waitingForOperand: true,
          };
        }
      }

      return prevState;
    });
  }, [calculate]);

  const performEquals = useCallback(() => {
    setState(prevState => {
      const inputValue = parseFloat(prevState.display);

      if (prevState.previousValue !== null && prevState.operation) {
        try {
          const result = calculate(prevState.previousValue, inputValue, prevState.operation);
          const resultStr = formatNumber(result);
          const historyEntry = `${prevState.previousValue} ${prevState.operation} ${inputValue} = ${result}`;

          return {
            ...prevState,
            display: resultStr,
            previousValue: null,
            operation: null,
            waitingForOperand: true,
            history: [...prevState.history, historyEntry].slice(-10),
          };
        } catch (error) {
          return {
            ...prevState,
            display: 'Error',
            previousValue: null,
            operation: null,
            waitingForOperand: true,
          };
        }
      }

      return prevState;
    });
  }, [calculate]);

  const performFunction = useCallback((func: string) => {
    setState(prevState => {
      const inputValue = parseFloat(prevState.display);
      let result: number;

      try {
        switch (func) {
          case 'sqrt':
            result = CalcEngine.sqrt(inputValue);
            break;
          case 'sin':
            result = CalcEngine.sin(inputValue, angleMode);
            break;
          case 'cos':
            result = CalcEngine.cos(inputValue, angleMode);
            break;
          case 'tan':
            result = CalcEngine.tan(inputValue, angleMode);
            break;
          case 'log':
            result = CalcEngine.log(inputValue);
            break;
          case 'ln':
            result = CalcEngine.ln(inputValue);
            break;
          case 'exp':
            result = CalcEngine.exp(inputValue);
            break;
          case 'abs':
            result = CalcEngine.abs(inputValue);
            break;
          case 'factorial':
            result = CalcEngine.factorial(inputValue);
            break;
          case '1/x':
            result = CalcEngine.divide(1, inputValue);
            break;
          case 'x²':
            result = CalcEngine.power(inputValue, 2);
            break;
          case 'x³':
            result = CalcEngine.power(inputValue, 3);
            break;
          case '±':
            result = -inputValue;
            break;
          default:
            result = inputValue;
        }

        const resultStr = formatNumber(result);
        const historyEntry = `${func}(${inputValue}) = ${result}`;

        return {
          ...prevState,
          display: resultStr,
          waitingForOperand: true,
          history: [...prevState.history, historyEntry].slice(-10),
        };
      } catch (error) {
        return {
          ...prevState,
          display: 'Error',
          waitingForOperand: true,
        };
      }
    });
  }, [angleMode]);

  const inputConstant = useCallback((constant: keyof typeof MATHEMATICAL_CONSTANTS) => {
    setState(prevState => ({
      ...prevState,
      display: formatNumber(MATHEMATICAL_CONSTANTS[constant]),
      waitingForOperand: true,
    }));
  }, []);

  const memoryOperation = useCallback((operation: string) => {
    setState(prevState => {
      const currentValue = parseFloat(prevState.display);

      switch (operation) {
        case 'MC':
          return { ...prevState, memory: 0 };
        case 'MR':
          return { ...prevState, display: formatNumber(prevState.memory), waitingForOperand: true };
        case 'MS':
          return { ...prevState, memory: currentValue };
        case 'M+':
          return { ...prevState, memory: prevState.memory + currentValue };
        case 'M-':
          return { ...prevState, memory: prevState.memory - currentValue };
        default:
          return prevState;
      }
    });
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      
      if (key >= '0' && key <= '9') {
        inputNumber(key);
      } else if (key === '.') {
        inputDecimal();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        performOperation(key);
      } else if (key === 'Enter' || key === '=') {
        performEquals();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clear();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputNumber, inputDecimal, performOperation, performEquals, clear]);

  return (
    <div 
      className="min-h-screen p-4 relative"
      style={{
        backgroundImage: `url('/src/assets/boybg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
              <CalcIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Computational</h1>
              <h2 className="text-lg font-medium text-orange-300 -mt-1">Math Bestie</h2>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setShowUnitConverter(true)}
              variant="function"
              className="!h-10 !px-3 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setShowStatistics(true)}
              variant="function"
              className="!h-10 !px-3 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50"
            >
              <TrendingUp className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setState(prev => ({ ...prev, isAdvancedMode: !prev.isAdvancedMode }))}
              variant="special"
              className="!h-10 !px-3 bg-purple-600/80 backdrop-blur-sm border border-purple-500/50"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Display */}
        <Display
          value={state.display}
          memory={state.memory}
          history={state.history}
        />

        {/* Mode Toggle */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-200 font-medium">
            Mode: {state.isAdvancedMode ? 'Advanced' : 'Standard'}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setAngleMode('deg')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                angleMode === 'deg' 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'bg-gray-800/80 text-gray-300 border border-gray-600/50 backdrop-blur-sm hover:bg-gray-700/80'
              }`}
            >
              DEG
            </button>
            <button
              onClick={() => setAngleMode('rad')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                angleMode === 'rad' 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'bg-gray-800/80 text-gray-300 border border-gray-600/50 backdrop-blur-sm hover:bg-gray-700/80'
              }`}
            >
              RAD
            </button>
          </div>
        </div>

        {/* Calculator Buttons */}
        <div className={`grid gap-3 ${state.isAdvancedMode ? 'grid-cols-6' : 'grid-cols-4'}`}>
          {/* Memory Row */}
          {state.isAdvancedMode && (
            <>
              <Button onClick={() => memoryOperation('MC')} variant="memory">MC</Button>
              <Button onClick={() => memoryOperation('MR')} variant="memory">MR</Button>
              <Button onClick={() => memoryOperation('MS')} variant="memory">MS</Button>
              <Button onClick={() => memoryOperation('M+')} variant="memory">M+</Button>
              <Button onClick={() => memoryOperation('M-')} variant="memory">M-</Button>
              <Button onClick={clear} variant="operator">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Advanced Functions Row 1 */}
          {state.isAdvancedMode && (
            <>
              <Button onClick={() => performFunction('sin')} variant="function">sin</Button>
              <Button onClick={() => performFunction('cos')} variant="function">cos</Button>
              <Button onClick={() => performFunction('tan')} variant="function">tan</Button>
              <Button onClick={() => performFunction('log')} variant="function">log</Button>
              <Button onClick={() => performFunction('ln')} variant="function">ln</Button>
              <Button onClick={() => performOperation('^')} variant="operator">x^y</Button>
            </>
          )}

          {/* Advanced Functions Row 2 */}
          {state.isAdvancedMode && (
            <>
              <Button onClick={() => performFunction('sqrt')} variant="function">√x</Button>
              <Button onClick={() => performFunction('x²')} variant="function">x²</Button>
              <Button onClick={() => performFunction('x³')} variant="function">x³</Button>
              <Button onClick={() => performFunction('1/x')} variant="function">1/x</Button>
              <Button onClick={() => performFunction('abs')} variant="function">|x|</Button>
              <Button onClick={() => performFunction('factorial')} variant="function">x!</Button>
            </>
          )}

          {/* Constants Row */}
          {state.isAdvancedMode && (
            <>
              <Button onClick={() => inputConstant('PI')} variant="special">π</Button>
              <Button onClick={() => inputConstant('E')} variant="special">e</Button>
              <Button onClick={() => inputConstant('PHI')} variant="special">φ</Button>
              <Button onClick={() => performOperation('mod')} variant="operator">mod</Button>
              <Button onClick={() => performFunction('exp')} variant="function">e^x</Button>
              <Button onClick={() => performFunction('±')} variant="operator">±</Button>
            </>
          )}

          {/* Standard Calculator Layout */}
          {!state.isAdvancedMode && (
            <Button onClick={clear} variant="operator" size="wide">Clear</Button>
          )}
          
          {!state.isAdvancedMode && (
            <>
              <Button onClick={() => performFunction('±')} variant="operator">±</Button>
              <Button onClick={() => performOperation('/')} variant="operator">÷</Button>
            </>
          )}

          {/* Number Rows */}
          <Button onClick={() => inputNumber('7')} variant="number">7</Button>
          <Button onClick={() => inputNumber('8')} variant="number">8</Button>
          <Button onClick={() => inputNumber('9')} variant="number">9</Button>
          <Button onClick={() => performOperation('*')} variant="operator">×</Button>
          {state.isAdvancedMode && (
            <>
              <Button onClick={() => performFunction('sqrt')} variant="function">√</Button>
              <Button onClick={() => performOperation('^')} variant="operator">^</Button>
            </>
          )}

          <Button onClick={() => inputNumber('4')} variant="number">4</Button>
          <Button onClick={() => inputNumber('5')} variant="number">5</Button>
          <Button onClick={() => inputNumber('6')} variant="number">6</Button>
          <Button onClick={() => performOperation('-')} variant="operator">−</Button>
          {state.isAdvancedMode && (
            <>
              <Button onClick={() => inputConstant('PI')} variant="special">π</Button>
              <Button onClick={() => inputConstant('E')} variant="special">e</Button>
            </>
          )}

          <Button onClick={() => inputNumber('1')} variant="number">1</Button>
          <Button onClick={() => inputNumber('2')} variant="number">2</Button>
          <Button onClick={() => inputNumber('3')} variant="number">3</Button>
          <Button onClick={() => performOperation('+')} variant="operator">+</Button>
          {state.isAdvancedMode && (
            <>
              <Button onClick={() => performFunction('sin')} variant="function">sin</Button>
              <Button onClick={() => performFunction('cos')} variant="function">cos</Button>
            </>
          )}

          <Button onClick={() => inputNumber('0')} variant="number" size={state.isAdvancedMode ? "normal" : "wide"}>0</Button>
          {!state.isAdvancedMode && <Button onClick={inputDecimal} variant="number">.</Button>}
          {state.isAdvancedMode && (
            <>
              <Button onClick={inputDecimal} variant="number">.</Button>
              <Button onClick={() => performFunction('tan')} variant="function">tan</Button>
              <Button onClick={() => performFunction('log')} variant="function">log</Button>
            </>
          )}
          <Button onClick={performEquals} variant="operator" size={state.isAdvancedMode ? "normal" : "tall"}>=</Button>
          {state.isAdvancedMode && <Button onClick={() => performFunction('ln')} variant="function">ln</Button>}
        </div>

        {/* Attribution */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-400 fill-current" />
            <span>by</span>
            <a 
              href="https://github.com/marthaea" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors font-medium underline decoration-dotted underline-offset-2"
            >
              MPK
            </a>
          </p>
        </div>
      </div>

      {/* Modals */}
      <UnitConverter
        isOpen={showUnitConverter}
        onClose={() => setShowUnitConverter(false)}
      />
      <StatisticsPanel
        isOpen={showStatistics}
        onClose={() => setShowStatistics(false)}
      />
    </div>
  );
};

export default Calculator;