
import React from 'react';
import { Pokemon, Move } from '../types';
import HealthBar from './HealthBar';

interface BattleSceneProps {
  player: Pokemon;
  enemy: Pokemon;
  currentLog: string;
  isPlayerTurn: boolean;
  onMoveSelect: (move: Move) => void;
  isProcessing: boolean;
}

const BattleScene: React.FC<BattleSceneProps> = ({ 
  player, 
  enemy, 
  currentLog, 
  isPlayerTurn, 
  onMoveSelect,
  isProcessing
}) => {
  return (
    <div className="flex-1 flex flex-col bg-cover bg-center relative" style={{backgroundImage: 'url("https://img.freepik.com/free-vector/pixel-art-grass-field-landscape-background_52683-102553.jpg")'}}>
      <div className="absolute inset-0 bg-black/10" />

      {/* Arena */}
      <div className="flex-1 relative p-4 flex flex-col justify-between z-10">
        
        {/* Top: Enemy */}
        <div className="flex justify-end items-start mt-4">
           <div className="flex flex-col items-end gap-2">
             <div className="w-64"><HealthBar label={enemy.name} level={enemy.level} current={enemy.hp} max={enemy.maxHp} /></div>
             <img src={enemy.spriteUrl} className="w-32 md:w-48 object-contain drop-shadow-2xl animate-float-slow" />
           </div>
        </div>

        {/* Bottom: Player */}
        <div className="flex justify-start items-end mb-4">
           <div className="flex flex-col items-start gap-2">
             <img src={player.spriteUrl} className="w-40 md:w-64 object-contain drop-shadow-2xl scale-x-[-1] animate-float" />
             <div className="w-64"><HealthBar label={player.name} level={player.level} current={player.hp} max={player.maxHp} /></div>
           </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="h-1/3 bg-zinc-900 border-t-4 border-zinc-700 p-4 flex flex-col md:flex-row gap-4 z-20">
        {/* Message Log */}
        <div className="flex-1 bg-black/50 rounded-lg p-4 border border-zinc-700 overflow-y-auto">
          <p className="text-white font-pixel text-xs leading-relaxed tracking-tight">
            {currentLog || "Aguardando comando..."}
          </p>
        </div>

        {/* Commands */}
        <div className="grid grid-cols-2 gap-2 w-full md:w-80">
          {isPlayerTurn && !isProcessing ? (
            player.moves.map(m => (
              <button 
                key={m.name} 
                onClick={() => onMoveSelect(m)}
                className="bg-zinc-800 hover:bg-yellow-500 hover:text-black text-white border-2 border-zinc-600 font-pixel text-[10px] py-3 rounded-lg transition-all"
              >
                {m.name}
              </button>
            ))
          ) : (
            <div className="col-span-2 flex items-center justify-center">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scaleX(-1); }
          50% { transform: translateY(-10px) scaleX(-1); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default BattleScene;
