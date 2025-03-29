import { ref, set, onValue, remove, update, push, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { database } from './firebase-config.js';
import { getCurrentUser } from './auth.js';

// Funções para gerenciar salas
export const createRoom = async (roomId, roomData) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Garantir que o creator seja o uid do usuário
    const newRoom = {
      id: roomId || Date.now().toString(), // Usar o ID fornecido ou gerar um novo
      name: roomData.name,
      creator: user.uid,
      players: {
        0: user.uid // O criador é o primeiro jogador
      },
      created: new Date().toISOString(),
      status: 'waiting' // Adicionando status da sala
    };
    
    console.log('Criando sala:', newRoom);
    const roomRef = ref(database, `rooms/${newRoom.id}`);
    await set(roomRef, newRoom);
    console.log('Sala criada com sucesso:', newRoom.id);
    
    return newRoom.id;
  } catch (error) {
    console.error('Erro ao criar sala:', error);
    throw error;
  }
};

export const joinRoom = async (roomId) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const roomRef = ref(database, `rooms/${roomId}`);
    
    // Primeiro, obter os dados atuais da sala
    const snapshot = await new Promise((resolve, reject) => {
      onValue(roomRef, (snapshot) => {
        resolve(snapshot.val());
      }, (error) => {
        reject(error);
      });
    });

    if (!snapshot) throw new Error('Sala não encontrada');
    if (snapshot.players['1']) throw new Error('Sala já está cheia');

    console.log('Entrando na sala:', roomId);
    
    // Atualizar apenas o segundo jogador, mantendo o primeiro
    const updates = {};
    updates['players/1'] = user.uid;
    updates['status'] = 'waiting'; // Manter como waiting até que ambos os jogadores definam seus números

    await update(roomRef, updates);
    console.log('Entrou na sala com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao entrar na sala:', error);
    throw error;
  }
};

export const deleteRoom = async (roomId) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const roomRef = ref(database, `rooms/${roomId}`);
    await remove(roomRef);
    return true;
  } catch (error) {
    console.error('Erro ao deletar sala:', error);
    throw error;
  }
};

// Funções para observar mudanças
export const observeRoom = (roomId, callback) => {
  console.log('Iniciando observação da sala:', roomId);
  const roomRef = ref(database, `rooms/${roomId}`);
  return onValue(roomRef, (snapshot) => {
    const data = snapshot.val();
    console.log('Atualização recebida da sala:', roomId, data);
    callback(data);
  });
};

export const observeAvailableRooms = (callback) => {
  console.log('Iniciando observação das salas disponíveis');
  const roomsRef = ref(database, 'rooms');
  
  // Retornar a função de unsubscribe para limpar o listener
  return onValue(roomsRef, (snapshot) => {
    try {
      const rooms = snapshot.val() || {};
      console.log('Todas as salas recebidas:', rooms);
      
      const availableRooms = Object.entries(rooms)
        .filter(([_, room]) => {
          if (!room || !room.players) return false;
          
          // Verificar se a sala está disponível (não cheia e não em jogo)
          const players = room.players;
          const isAvailable = Object.keys(players).length === 1 && 
                              players['0'] && 
                              room.status === 'waiting';
          
          console.log('Sala disponível?', room.name, isAvailable, {
            playersCount: Object.keys(players).length,
            hasPlayer0: !!players['0'],
            status: room.status
          });
          
          return isAvailable;
        })
        .map(([id, room]) => ({ 
          id, 
          name: room.name,
          creator: room.creator,
          created: room.created,
          status: room.status
        }));
      
      console.log('Salas disponíveis filtradas:', availableRooms);
      callback(availableRooms);
    } catch (error) {
      console.error('Erro ao processar salas:', error);
      callback([]);
    }
  });
};

// Funções para gerenciar números dos jogadores
export const setPlayerNumber = async (roomId, playerNumber) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const roomRef = ref(database, `rooms/${roomId}`);
    
    // Primeiro, obter os dados atuais da sala
    const snapshot = await new Promise((resolve, reject) => {
      onValue(roomRef, (snapshot) => {
        resolve(snapshot.val());
      }, (error) => {
        reject(error);
      });
    });

    if (!snapshot) throw new Error('Sala não encontrada');
    
    // Verificar se o jogador já definiu seu número
    const playerIndex = Object.entries(snapshot.players).find(([_, uid]) => uid === user.uid)?.[0];
    if (!playerIndex) throw new Error('Jogador não encontrado na sala');
    
    if (snapshot.playerNumbers?.[playerIndex]) {
      throw new Error('Número já definido para este jogador');
    }

    // Atualizar o número do jogador
    const updates = {};
    updates[`playerNumbers/${playerIndex}`] = playerNumber;
    updates[`playerStatus/${playerIndex}`] = 'ready';

    await update(roomRef, updates);

    // Verificar se o jogo pode começar
    await checkGameStart(roomId);

    return true;
  } catch (error) {
    console.error('Erro ao definir número do jogador:', error);
    throw error;
  }
};

export const checkGameStart = async (roomId) => {
  try {
    const roomRef = ref(database, `rooms/${roomId}`);
    
    // Obter dados atuais da sala
    const snapshot = await get(roomRef);
    const roomData = snapshot.val();

    if (!roomData) throw new Error('Sala não encontrada');
    
    // Verificar se temos dois jogadores na sala
    const playerCount = Object.keys(roomData.players || {}).length;
    if (playerCount < 2) {
      console.log('Aguardando o segundo jogador...');
      return false;
    }
    
    // Verificar se todos os jogadores estão prontos
    const playerStatuses = roomData.playerStatus || {};
    const allPlayersReady = Object.values(playerStatuses).every(status => status === 'ready');
    
    // Verificar se temos todos os números necessários
    const playerNumbers = roomData.playerNumbers || {};
    const allNumbersSet = Object.keys(roomData.players).every(index => playerNumbers[index]);
    
    console.log('Status do jogo:', {
      playerCount,
      allPlayersReady,
      allNumbersSet,
      playerStatuses,
      playerNumbers
    });
    
    if (allPlayersReady && allNumbersSet) {
      console.log('Iniciando o jogo...');
      
      // Atualizar apenas os campos necessários, preservando a sala
      await update(roomRef, {
        status: 'playing',
        gameStarted: new Date().toISOString()
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao verificar início do jogo:', error);
    throw error;
  }
}; 