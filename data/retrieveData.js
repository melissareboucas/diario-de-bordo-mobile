import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig.ts'; 


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

    console.log('Usuários:', userList);
    return userList;
  } catch (error) {
    console.error('Erro ao listar usuários: ', error);
  }
};

const getTravelsByUser = async (user_id) => {
  try {
    const travelsCollection = collection(db, 'travels');

    const travelsQuery = query(travelsCollection, where("user_id", "==", user_id))

    const travelsSnapshot = await getDocs(travelsQuery);

    const travelsList = travelsSnapshot.docs.map(doc => ({
      travel_id: doc.id,
      ...doc.data()
    }));

    console.log('Usuários:', travelsList);
    return travelsList;
  } catch (error) {
    console.error('Erro ao listar usuários: ', error);
  }
};


export { listUsers, getTravelsByUser };
