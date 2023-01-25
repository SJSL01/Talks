import { useEffect } from 'react'
import AllUsers from './AllUsers'
import Chat from './Chat'

export default function Layout() {


    return (
        <div style={{ display: "flex" }}>
            <AllUsers />
            <Chat />
        </div>
    )
}
