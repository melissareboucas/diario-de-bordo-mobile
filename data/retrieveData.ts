import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface CityInfo {
  count: number;
  originCity: string
  originLatitude: number
  originLongitude: number
}

// Define a estrutura do objeto cityCount
interface CityCount {
  [key: string]: CityInfo;
}

const getUserById = async (id: string) => {
  try {
    const userCollection = collection(db, 'users');

    const userQuery = query(userCollection, where("__name__", "==", id))

    const userSnapshot = await getDocs(userQuery);

    const userList = userSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        user_id: doc.id,
        name: data.name || "Nome não informado",
        username: data.username || "Usuário não informado",
        profile_image: data.profile_image || "url_padrao_para_imagem",
        background_image: data.background_image || "url_padrao_para_imagem",
      };
    });

    return userList;
  } catch (error) {
    console.error('Erro ao buscar usuário: ', error);
  }
};

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

const getTotalKmByUser = async (id: string) => {
  try {

    const travelsCollection = collection(db, 'travels');

    const travelsQuery = query(travelsCollection, where("user_id", "==", id))

    const travelsSnapshot = await getDocs(travelsQuery);

    let totalKm = 0;

    travelsSnapshot.forEach((doc) => {
      totalKm += doc.data().distanceinmeters;
    });

    const sumKm = Math.ceil(Number(totalKm) / 1000);
    const formattedValue = formatNumber(sumKm);
    return formattedValue;

  } catch (error) {
    console.error('Erro ao somar total de km: ', error);
  }
}

const getCitiesByUser = async (id: string) => {
  try {

    const travelsCollection = collection(db, 'travels');

    const travelsQuery = query(travelsCollection, where("user_id", "==", id))

    const travelsSnapshot = await getDocs(travelsQuery);

    const distinctDestinyCities = new Set<string>();

    travelsSnapshot.forEach((doc) => {
      const data = doc.data();
      
      if (data.destinycity) {
        distinctDestinyCities.add(data.destinycity);
      }
    });

    return distinctDestinyCities.size.toString();

  } catch (error) {
    console.error('Erro ao contabilizar cidades: ', error);
  }
}

const getTravels = async () => {
  try {
    const travelsCollection = collection(db, 'travels');

    const travelsQuery = query(travelsCollection, orderBy("date", "desc"))

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


function formatNumber(num: number): string {
  const million = 1000000;
  const thousand = 1000;
  if (num >= million) {
    return (num / million).toFixed(1) + 'M';
  } else if (num >= thousand) {
    return (num / thousand).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
}

export {
  getUserById,
  listUsers,
  getTravelsByUser,
  getTravelById,
  getPostsByTravel,
  getPostById,
  searchTravels,
  getTotalKmByUser,
  getCitiesByUser,
  getTravels
};
