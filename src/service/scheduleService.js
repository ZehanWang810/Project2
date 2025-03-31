import { db } from '../firebase';
import { collection, addDoc, getDocs } from '@firebase/firestore';

export const getGameSchedule = async () => {
  const snapshot = await getDocs(collection(db, 'game_schedule'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addGameToSchedule = async (gameData) => {
  return await addDoc(collection(db, 'game_schedule'), gameData);
};