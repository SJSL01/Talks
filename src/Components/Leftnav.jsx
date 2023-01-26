import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'

export default function Leftnav() {

    const navigate = useNavigate();



    return (
        <div className='left-nav'>
            <img referrerPolicy='no-referrer' style={{ width: "5vh", height: "5vh" }} src={auth.currentUser.photoURL} alt="" />
            {auth.currentUser.displayName}
            <Button variant="outlined" color="error"
                onClick={() => {
                    auth.signOut()
                    navigate("/", { replace: true })
                }}>SIGNOUT</Button>
            <Button variant="outlined" color="error"
                onClick={() => { auth.currentUser.delete() }}>DELETE</Button>
        </div>
    )
}
