
import React from 'react';

interface HealthBarProps {
  current: number;
  max: number;
  label: string;
  level: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ current, max, label, level }) => {
  const percentage = Math.max(0, (current / max) * 100);
  const barColor = percentage > 50 ? 'bg-green-500' : percentage > 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-white p-3 rounded-lg border-4 border-gray-800 shadow-md w-full max-w-xs">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold uppercase text-xs">{label}</span>
        <span className="text-xs font-bold text-gray-600">Lv{level}</span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-800">
        <div 
          className={`h-full ${barColor} transition-all duration-500 ease-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right mt-1">
        <span className="text-xs font-mono font-bold">{current} / {max} HP</span>
      </div>
    </div>
  );
};

export default HealthBar;
