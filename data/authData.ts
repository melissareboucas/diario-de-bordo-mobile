import { collection, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth'


const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    
    const usersCollection = collection(db, 'users');

    const userDoc = await getDoc(doc(usersCollection, uid));
    if (userDoc.exists()) {
      return { ...userCredential.user, ...userDoc.data() };
    } else {
      console.log("Nenhum documento encontrado para o usuário.");
      return userCredential.user;
    }

  } catch (error) {
    console.error("Erro ao fazer login:", error);
  }
};




export { signIn };