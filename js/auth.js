import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { app } from './firebase-config.js';

const auth = getAuth(app);

export const signIn = async (username) => {
  try {
    const userCredential = await signInAnonymously(auth);
    // Atualiza o token com o nome do usuário
    await userCredential.user.updateProfile({
      displayName: username
    });
    return userCredential.user;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
}; 