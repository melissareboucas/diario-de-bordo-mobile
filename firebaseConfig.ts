import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Adicione outros serviços do Firebase se necessário

// Configuração do Firebase
const firebaseConfig = {

};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Exportar outras instâncias do Firebase se necessário

export { app, db };
