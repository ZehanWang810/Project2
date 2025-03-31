import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from '@firebase/firestore';

export const getTrainingPlans = async () => {
  const snapshot = await getDocs(collection(db, 'training_plans'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addTrainingPlan = async (planData) => {
  return await addDoc(collection(db, 'training_plans'), planData);
};

// Add more CRUD operations as needed