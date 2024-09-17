import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 


const listUsers = async () => {
  try {
    // Referência para a coleção 'users'
    const usersCollection = collection(db, 'users');

    // Obtém todos os documentos da coleção
    const userSnapshot = await getDocs(usersCollection);

    // Mapeia os documentos para extrair os dados
    const userList = userSnapshot.docs.map(doc => ({
      user_id: doc.id,
      ...doc.data()
    }));
    return userList;
  } catch (error) {
    console.error('Erro ao listar usuários: ', error);
  }
};

const getTravelsByUser = async (user_id: string) => {
  try {
    const travelsCollection = collection(db, 'travels');

    const travelsQuery = query(travelsCollection, where("user_id", "==", user_id), orderBy("date", "desc"))

    const travelsSnapshot = await getDocs(travelsQuery);

    const travelsList = travelsSnapshot.docs.map(doc => ({
      travel_id: doc.id,
      ...doc.data()
    }));
    return travelsList;
  } catch (error) {
    console.error('Erro ao listar vigens: ', error);
  }
};

const getTravelById = async (travel_id: string) => {
  try {
    const travelsCollection = collection(db, 'travels');

    const travelQuery = query(travelsCollection, where("__name__", "==", travel_id))

    const travelSnapshot = await getDocs(travelQuery);

    const travel = travelSnapshot.docs.map(doc => ({
      travel_id: doc.id,
      ...doc.data()
    }));
    
    return travel;
  } catch (error) {
    console.error('Erro ao listar viagem: ', error);
  }
};

const getPostsByTravel = async (travel_id: string) => {
  try {
    const postsCollection = collection(db, 'posts');

    const postsQuery = query(postsCollection, where("travel_id", "==", travel_id), orderBy("post_date", "desc"))

    const postsSnapshot = await getDocs(postsQuery);

    const postsList = postsSnapshot.docs.map(doc => ({
      post_id: doc.id,
      ...doc.data()
    }));
    return postsList;
  } catch (error) {
    console.error('Erro ao listar postagens: ', error);
  }
};


export { listUsers, getTravelsByUser, getTravelById, getPostsByTravel };
