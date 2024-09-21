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
    console.error('Erro ao listar viagens: ', error);
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

const getPostById = async (post_id: string) => {
  try {
    const postsCollection = collection(db, 'posts');

    const postQuery = query(postsCollection, where("__name__", "==", post_id))

    const postSnapshot = await getDocs(postQuery);

    const post = postSnapshot.docs.map(doc => ({
      post_id: doc.id,
      ...doc.data()
    }));
    
    return post;
  } catch (error) {
    console.error('Erro ao listar diário: ', error);
  }
};

const searchTravels = async (user_id: string, text: string) => {

  if (text) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

  try {
    const travelsCollection = collection(db, 'travels');

    const travelsQuery = query(travelsCollection, where("destinycity", "==", text), orderBy("date", "desc"))

    const travelsSnapshot = await getDocs(travelsQuery);

    const travelsList = travelsSnapshot.docs.map(doc => ({
      travel_id: doc.id,
      ...doc.data()
    }));
    return travelsList;
  } catch (error) {
    console.error('Erro ao listar viagens: ', error);
  }
};

export { listUsers, getTravelsByUser, getTravelById, getPostsByTravel, getPostById, searchTravels };
