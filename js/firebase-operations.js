import { ref, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { database } from './firebase-config.js';

// Funções para gerenciar salas
export const createRoom = async (roomId, roomData) => {
  try {
    await set(ref(database, `rooms/${roomId}`), roomData);
    return roomId;
  } catch (error) {
    console.error('Erro ao criar sala:', error);
    throw error;
  }
};

export const joinRoom = async (roomId, playerData) => {
  try {
    const roomRef = ref(database, `rooms/${roomId}`);
    await update(roomRef, {
      players: playerData
    });
    return true;
  } catch (error) {
    console.error('Erro ao entrar na sala:', error);
    throw error;
  }
};

export const deleteRoom = async (roomId) => {
  try {
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
  const roomRef = ref(database, `rooms/${roomId}`);
  return onValue(roomRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export const observeAvailableRooms = (callback) => {
  const roomsRef = ref(database, 'rooms');
  return onValue(roomsRef, (snapshot) => {
    const rooms = snapshot.val() || {};
    const availableRooms = Object.entries(rooms)
      .filter(([_, room]) => room.players.length === 1)
      .map(([id, room]) => ({ id, ...room }));
    callback(availableRooms);
  });
}; 