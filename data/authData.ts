import { collection, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'


const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;


    const usersCollection = collection(db, 'users');

    const userDoc = await getDoc(doc(usersCollection, uid));
    if (userDoc.exists()) {
      return {
        user_id: uid
      }
    } else {
      console.log("Nenhum documento encontrado para o usuário.");
      return userCredential.user;
    }

  } catch (error) {
    console.error("Erro ao fazer login:", error);
  }
};

const createUser = async (email: string, password: string) => {
  try {
    // Criação do novo usuário com email e senha
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Usuário criado com sucesso
    const user_id = userCredential.user.uid;
    //console.log('Usuário criado com sucesso:', user_id);
    
    return user_id; // Retorna o objeto do usuário recém-criado
  } catch (error) {
    // Erro ao criar o usuário
    console.error('Erro ao criar o usuário:', error);
  }
};



export { signIn, createUser };