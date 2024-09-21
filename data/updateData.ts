import { collection, updateDoc, Timestamp, doc } from 'firebase/firestore';
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

interface postData {
    user_id: string;
    travel_id: string;
    post_text: string;
    title: string;
    post_date: Timestamp;
}

const updatePost = async (post: postData, post_id: string) => {
    try {
        const postRef = doc(db, 'posts', post_id);
        await updateDoc(postRef, post as { [key: string]: any });
    } catch (e) {
        console.error('Error adding document: ', e);
    }
};

export { updatePost };