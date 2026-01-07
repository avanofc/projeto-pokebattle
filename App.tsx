
import React, { useState, useEffect } from 'react';
import { Pokemon, Move, BattleState, GameView } from './types';
import { POKEMON_DATABASE, TYPE_CHART } from './constants';
import { getBattleNarration, getEnemyMoveDecision } from './geminiService';
import BattleScene from './components/BattleScene';

const App: React.FC = () => {
  const [view, setView] = useState<GameView>(GameView.MENU);
  const [selectedStarter, setSelectedStarter] = useState<Pokemon | null>(null);
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLog, setCurrentLog] = useState("");
  const [shake, setShake] = useState<'player' | 'enemy' | null>(null);

  const calculateDamage = (attacker: Pokemon, defender: Pokemon, move: Move) => {
    let multiplier = 1;
    if (TYPE_CHART[move.type]?.[defender.type]) {
      multiplier = TYPE_CHART[move.type][defender.type]!;
    }
    const baseDamage = Math.floor((move.power * (attacker.attack / defender.defense)) / 5);
    return Math.floor(baseDamage * multiplier);
  };

  const startJourney = (starter: Pokemon) => {
    setSelectedStarter(starter);
    setView(GameView.PARTY); // Usando PARTY como tela de "Encontro"
    setTimeout(() => spawnEnemy(starter), 2000);
  };

  const spawnEnemy = (playerPoke: Pokemon) => {
    const randomEnemy = POKEMON_DATABASE[Math.floor(Math.random() * POKEMON_DATABASE.length)];
    const enemyCopy = JSON.parse(JSON.stringify(randomEnemy));
    const playerCopy = JSON.parse(JSON.stringify(playerPoke));

    setBattle({
      playerActive: playerCopy,
      enemyActive: enemyCopy,
      turn: 'player',
      log: [],
      isGameOver: false
    });
    setCurrentLog(`Um ${enemyCopy.name} apareceu!`);
    setView(GameView.BATTLE);
  };

  const handleMove = async (move: Move, isPlayer: boolean) => {
    if (!battle || isProcessing) return;
    setIsProcessing(true);

    const attacker = isPlayer ? battle.playerActive : battle.enemyActive;
    const defender = isPlayer ? battle.enemyActive : battle.playerActive;

    const damage = calculateDamage(attacker, defender, move);
    const newHp = Math.max(0, defender.hp - damage);

    // Efeito visual de dano
    setShake(isPlayer ? 'enemy' : 'player');
    setTimeout(() => setShake(null), 500);

    const narration = await getBattleNarration(
      attacker.name,
      defender.name,
      move.name,
      damage,
      newHp,
      false
    );
    setCurrentLog(narration);

    setBattle(prev => {
      if (!prev) return null;
      const nextTurn = isPlayer ? 'enemy' : 'player';
      const isGameOver = newHp <= 0;
      
      const newState = { ...prev };
      if (isPlayer) {
        newState.enemyActive = { ...prev.enemyActive, hp: newHp };
      } else {
        newState.playerActive = { ...prev.playerActive, hp: newHp };
      }
      
      newState.turn = isGameOver ? prev.turn : nextTurn;
      newState.isGameOver = isGameOver;
      if (isGameOver) newState.winner = isPlayer ? 'player' : 'enemy';
      
      return newState;
    });

    setIsProcessing(false);
  };

  useEffect(() => {
    if (battle?.turn === 'enemy' && !battle.isGameOver && !isProcessing) {
      const runEnemyTurn = async () => {
        await new Promise(r => setTimeout(r, 2000));
        const moveNames = battle.enemyActive.moves.map(m => m.name);
        const chosen = await getEnemyMoveDecision(battle.enemyActive.name, battle.playerActive.name, moveNames);
        const move = battle.enemyActive.moves.find(m => m.name === chosen) || battle.enemyActive.moves[0];
        handleMove(move, false);
      };
      runEnemyTurn();
    }
  }, [battle?.turn, battle?.isGameOver]);

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-0 md:p-4">
      <div className="w-full max-w-5xl aspect-[16/9] bg-black relative shadow-2xl overflow-hidden border-0 md:border-8 border-zinc-800 md:rounded-3xl">
        
        {view === GameView.MENU && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-900 flex flex-col items-center justify-center text-white">
            <div className="mb-8 animate-bounce">
               <svg className="w-24 h-24" viewBox="0 0 24 24" fill="white">
                 <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4C7.58,4 4,7.58 4,12C4,12.15 4,12.3 4,12.45C4.05,12.55 4.1,12.66 4.15,12.75H8.1C8.55,11.16 10.14,10 12,10C13.86,10 15.45,11.16 15.9,12.75H19.85C19.9,12.66 19.95,12.55 20,12.45C20,12.3 20,12.15 20,12C20,7.58 16.42,4 12,4M12,14C10.14,14 8.55,12.84 8.1,11.25H4.15C4.6,15.65 8.13,19.2 12.55,19.85C12.37,19.95 12.19,20 12,20C7.58,20 4,16.42 4,12C4,11.85 4,11.7 4,11.55H7.9C8.35,13.14 9.94,14.3 11.8,14.3C13.66,14.3 15.25,13.14 15.7,11.55H19.6C19.15,15.95 15.62,19.5 11.2,19.85C11.38,19.95 11.56,20 11.75,20C16.17,20 19.75,16.42 19.75,12C19.75,11.85 19.75,11.7 19.75,11.55H15.85C15.4,13.14 13.81,14.3 12,14.3V14Z" />
               </svg>
            </div>
            <h1 className="text-5xl font-pixel mb-12 tracking-tighter">POKEQUEST ONLINE</h1>
            <div className="flex gap-4">
               {POKEMON_DATABASE.slice(0, 4).map(p => (
                 <button key={p.id} onClick={() => startJourney(p)} className="bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all border border-white/30 group">
                   <img src={p.spriteUrl} className="w-20 group-hover:scale-110" />
                   <p className="font-pixel text-[10px] mt-2">{p.name}</p>
                 </button>
               ))}
            </div>
          </div>
        )}

        {view === GameView.PARTY && (
          <div className="absolute inset-0 bg-green-500 flex flex-col items-center justify-center text-white animate-pulse">
            <h2 className="text-2xl font-pixel mb-4 text-center px-4">EXPLORANDO A ROTA 1...</h2>
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
              <img src={selectedStarter?.spriteUrl} className="w-24 animate-bounce" />
            </div>
          </div>
        )}

        {view === GameView.BATTLE && battle && (
          <div className="h-full flex flex-col">
            <BattleScene 
              player={battle.playerActive}
              enemy={battle.enemyActive}
              currentLog={currentLog}
              isPlayerTurn={battle.turn === 'player'}
              onMoveSelect={(m) => handleMove(m, true)}
              isProcessing={isProcessing}
            />
            
            {/* Overlay de Dano */}
            {shake === 'player' && <div className="absolute inset-0 bg-red-500/30 animate-ping pointer-events-none" />}
            {shake === 'enemy' && <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />}

            {battle.isGameOver && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-8">
                <h2 className="text-4xl font-pixel text-yellow-400 mb-6">{battle.winner === 'player' ? 'VITÓRIA!' : 'DERROTA...'}</h2>
                <button onClick={() => setView(GameView.MENU)} className="bg-white text-black font-pixel px-8 py-4 rounded-full hover:bg-yellow-400 transition-colors">
                  RECOMEÇAR JORNADA
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
