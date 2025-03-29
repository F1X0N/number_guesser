import { ref, set, onValue, remove, update, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { database } from './firebase-config.js';
import { getCurrentUser } from './auth.js';

// Funções para gerenciar salas
export const createRoom = async (roomId, roomData) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Garantir que o creator seja o uid do usuário
    const newRoom = {
      id: roomId || Date.now().toString(),
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
    
    // Primeiro, verificar se a sala existe e está disponível
    const snapshot = await onValue(roomRef, (snapshot) => {
      const room = snapshot.val();
      if (!room) throw new Error('Sala não encontrada');
      if (room.players['1']) throw new Error('Sala já está cheia');
      if (room.status !== 'waiting') throw new Error('Sala não está disponível');
    });

    console.log('Entrando na sala:', roomId);
    await update(roomRef, {
      players: {
        1: user.uid // O segundo jogador
      },
      status: 'playing' // Atualizar status da sala
    });
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
      console.log('Dados brutos recebidos do Firebase:', rooms);
      
      // Converter o objeto de salas em array
      const roomsArray = Object.entries(rooms).map(([id, room]) => ({
        id,
        ...room
      }));
      
      console.log('Salas convertidas para array:', roomsArray);
      
      const availableRooms = roomsArray.filter(room => {
        if (!room || !room.players) {
          console.log('Sala inválida:', room);
          return false;
        }
        
        const players = room.players;
        const isAvailable = Object.keys(players).length === 1 && 
                          players['0'] && 
                          room.status === 'waiting';
        
        console.log('Verificando sala:', room.name, {
          playersCount: Object.keys(players).length,
          hasPlayer0: !!players['0'],
          status: room.status,
          isAvailable
        });
        
        return isAvailable;
      });
      
      console.log('Salas disponíveis filtradas:', availableRooms);
      callback(availableRooms);
    } catch (error) {
      console.error('Erro ao processar salas:', error);
      callback([]);
    }
  });
}; 