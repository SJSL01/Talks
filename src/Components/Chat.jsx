import { Button } from '@mui/material'
import { doc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { auth, db } from '../firebase'

export default function Chat() {
    const navigate = useNavigate();

    const handleSignOut = () => {
        auth.signOut()
        navigate("/", { replace: true })
    }

    useEffect(() => {
        if (auth.currentUser.providerData.providerId === "google.com") {
            console.log("sdadd");
            save()
        }
    }, [])

    const save = async () => {
        console.log("yes");
        try {
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                uid: auth.currentUser.uid,
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", auth.currentUser.uid), {});
        } catch (error) {
            console.log(error);
        }
    }

    console.log(auth.currentUser.emailVerified);

    return (
        <div>
            <h1>CHAT</h1>
            <img referrerPolicy='no-referrer' style={{ height: "50vh", width: "50vh" }} src={auth.currentUser.photoURL} alt="" />
            {auth.currentUser.displayName}
            <Button variant="outlined" color="error"
                onClick={handleSignOut}>SIGNOUT</Button>
            <Button variant="outlined" color="error"
                onClick={() => { auth.currentUser.delete() }}>DELETE</Button>
        </div>
    )
}
