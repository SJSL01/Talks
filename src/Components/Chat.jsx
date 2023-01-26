import { Button } from '@mui/material'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { auth, db } from '../firebase'

export default function Chat() {


    useEffect(() => {
       checkUser()
    }, [])

    const checkUser = async () => {

        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());

        } else {
            save()
            console.log("No such document!");
        }
    }


    const save = async () => {
        console.log("yes");
        try {
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                uid: auth.currentUser.uid,
                username: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", auth.currentUser.uid), {});
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div>
            <h1>CHAT</h1>
        </div>
    )
}
