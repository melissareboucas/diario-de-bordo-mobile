import { collection, addDoc, Timestamp } from 'firebase/firestore';
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

export { addTravel, addPost };