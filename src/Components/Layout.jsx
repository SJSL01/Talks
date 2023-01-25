import { Container, Box } from '@mui/material'
import React from 'react'
import AllUsers from './AllUsers'
import Chat from './Chat'

export default function Layout() {
    return (
        <Container>
            <Chat />
            <AllUsers />
        </Container>
    )
}
