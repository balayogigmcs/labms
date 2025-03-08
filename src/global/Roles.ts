// export type roleType = "admin" | "administrator" | "client" | "employee";

import {db} from "../firebaseConfig";
import {doc, getDoc,setDoc} from "firebase/firestore";

/**
 * Fetches the user role from Firestore
 * @param uid - The user's UID
 * @returns {Promise<string | null>} The user role or null if not found
 */

export const getRole =async (uid:string):Promise<string | null>  => {
    try {
        const userDocRef = doc(db,"users",uid);
        const userDoc = await getDoc(userDocRef);

        if(userDoc.exists()){
            const userData = userDoc.data();
            console.log("Fetched Role:", userData.role);
            return userData.role || null;
        } else {
            console.warn("User document does not exist.");
            return null;
        }

    } catch(error){
        console.error("Error fetching role: ",error);
        return null;
    }
};


export const setRole = async(uid:string ,role:string ):Promise<void> =>{
    try{
        const userDocRef = doc(db,"users",uid);
        await setDoc(userDocRef,{role});
        console.log('Role updated to :${role}');
    } catch(error){
        console.error("Error in setting role ",error);
    }
}
