
import { GoogleGenAI, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper para decodificar áudio PCM retornado pelo Gemini
async function playPCMAudio(base64Data: string) {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const frameCount = dataInt16.length;
    const buffer = audioContext.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
  } catch (e) {
    console.error("Erro ao reproduzir áudio TTS:", e);
  }
}

export const narrateBattleAction = async (text: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Narre com empolgação: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (audioData) {
      await playPCMAudio(audioData);
    }
  } catch (error) {
    console.warn("TTS falhou ou não suportado:", error);
  }
};

export const getBattleNarration = async (
  attacker: string,
  defender: string,
  move: string,
  damage: number,
  remainingHp: number,
  isCritical: boolean
): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `
      Você é um narrador épico de batalhas Pokémon em português.
      Contexto: ${attacker} atacou ${defender} com ${move}, causando ${damage} de dano. ${defender} agora tem ${remainingHp} HP.
      Gere uma descrição curta e impactante.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const narrationText = response.text || `${attacker} usou ${move}!`;
    // Dispara narração por voz em paralelo
    narrateBattleAction(narrationText);
    
    return narrationText;
  } catch (error) {
    return `${attacker} usou ${move}!`;
  }
};

export const getEnemyMoveDecision = async (
  enemyPokemon: string,
  playerPokemon: string,
  availableMoves: string[]
): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `Como treinador rival, escolha o melhor golpe para seu ${enemyPokemon} contra o ${playerPokemon} do jogador. Opções: ${availableMoves.join(', ')}. Retorne apenas o nome do golpe.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    const chosen = response.text?.trim() || availableMoves[0];
    return availableMoves.includes(chosen) ? chosen : availableMoves[0];
  } catch (error) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
};
