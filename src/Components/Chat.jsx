import { Button } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { auth } from '../firebase'

export default function Chat() {
    const navigate = useNavigate();

    const handleSignOut = () => {
        auth.signOut()
        navigate("/", { replace: true })
    }

    return (
        <div>
            <h1>CHAT</h1>
            <Button variant="outlined" color="error"
                onClick={handleSignOut}>SIGNOUT</Button>
        </div>
    )
}
