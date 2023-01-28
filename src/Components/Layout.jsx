
import AllUsers from './MyChats'
import Chat from './Chat'
import Leftnav from './Leftnav'
import "../Styles/Layout.css"
import { useEffect } from 'react'
import { useContext } from 'react'
import UserContext from '../Context/UserContext'
import { auth } from '../firebase'

export default function Layout() {


    const { user, checkUser, userOptions } = useContext(UserContext)

    useEffect(() => {
        checkUser()

    }, [])

    //console.log(userOptions);

    return (
        <>
            {user?.uid === auth.currentUser.uid ?
                <div style={{ display: "flex" }} className={user?.uid === auth.currentUser.uid ? "show layout" : "hide layout"}>
                    <div className={userOptions ? "chat-left enableBlur" : "chat-left"}>
                        <Leftnav />
                        <AllUsers />
                    </div>
                    <div className="chat-right">
                        <Chat />
                    </div>
                </div>
                :

                <h1 className={user?.uid != auth.currentUser.uid ? "show" : "hide"}>
                    LOADING
                </h1>}
        </>
    )
}
