import { collection, addDoc, Timestamp, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface travelData {
    user_id: string;
    origincity: string;
    destinycity: string;
    distanceinmeters: number;
    travel_image: string;
    date: Timestamp;
    description: string;
}

interface postData {
    user_id: string;
    travel_id: string;
    post_text: string;
    title: string;
    post_date: Timestamp;
}

interface userData {
    name: string,
    username: string,
    background_image: string,
    profile_image: string
}

const addTravel = async (travel: travelData) => {
    try {
        const docRef = await addDoc(collection(db, 'travels'), travel);
    } catch (e) {
        console.error('Error adding document: ', e);
    }
};

const addPost = async (post: postData) => {
    try {
        const docRef = await addDoc(collection(db, 'posts'), post);
    } catch (e) {
        console.error('Error adding document: ', e);
    }
};

const addUser = async (user: userData, documentId: string) => {
    try {
      // Cria uma referência ao documento com o ID especificado
      const docRef = doc(collection(db, 'users'), documentId);
  
      // Usa setDoc para criar ou sobrescrever o documento
      await setDoc(docRef, user);
  
      console.log('Documento criado com sucesso!');
    } catch (e) {
      console.error('Erro ao adicionar o documento: ', e);
    }
  };

export { addTravel, addPost, addUser };