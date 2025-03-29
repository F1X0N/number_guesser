import { getAuth, signInAnonymously, signInWithEmailAndPassword, updateProfile, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { app } from './firebase-config.js';

const auth = getAuth(app);

export const signIn = async (username, isDeveloper = false) => {
  try {
    let userCredential;
    
    if (isDeveloper) {
      // Login do desenvolvedor com email/senha
      const email = 'admin@numberguesser.local';
      const password = 'admin123';
      
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } else {
      // Login anônimo para jogadores
      userCredential = await signInAnonymously(auth);
    }

    // Atualizar o displayName do usuário
    await updateProfile(userCredential.user, {
      displayName: username
    });

    // Salvar informações do usuário no localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('userType', isDeveloper ? 'developer' : 'player');
    localStorage.setItem('userUid', userCredential.user.uid);

    return userCredential.user;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
    // Limpar informações do usuário do localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    localStorage.removeItem('userUid');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Usuário não autenticado'));
      }
    });
  });
}; 