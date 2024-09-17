import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface travelData {
    user_id: string;
    origincity: string;
    origincountry: string;
    originlatitude: number;
    originlongitude: number;
    destinycity: string;
    destinycountry: string;
    destinylatitude: number;
    destinylongitude: number;
    distanceinmeters: number;
    modal: string;
    travel_image: string;
    date: Timestamp;
    description: string;
}

const addTravel = async (travel: travelData) => {
    try {
        const docRef = await addDoc(collection(db, 'travels'), travel);
    } catch (e) {
        console.error('Error adding document: ', e);
    }
};

export { addTravel };