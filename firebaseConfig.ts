import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// Adicione outros serviços do Firebase se necessário

// Configuração do Firebase
const firebaseConfig = {

};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
// Exportar outras instâncias do Firebase se necessário

export { app, db, storage };
