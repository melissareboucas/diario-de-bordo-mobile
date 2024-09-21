import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 


const deleteTravelById = async (travel_id: string) => {
  
  try {
    
    const postsCollection = collection(db, 'posts');

    const postsQuery = query(postsCollection, where("travel_id", "==", travel_id));

    const postsSnapshot = await getDocs(postsQuery);

    postsSnapshot.forEach(async (post) => {
        const postRef = doc(db, 'posts', post.id);

        await deleteDoc(postRef);
    });

    const travelRef = doc(db, 'travels', travel_id);
    await deleteDoc(travelRef);

  } catch (error) {
    console.error('Erro ao deletar: ', error);
  }
};

const deletePostById = async (post_id: string) => {
  try {
    const postRef = doc(db, 'posts', post_id);
    await deleteDoc(postRef);
  } catch (error) {
    console.error('Erro ao deletar: ', error);
  }
};




export { deleteTravelById, deletePostById };
