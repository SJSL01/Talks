
import AllUsers from './MyChats'
import Chat from './Chat'
import Leftnav from './Leftnav'
import "../Styles/Layout.css"
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import UserContext from '../Context/UserContext'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function Layout() {

    const navigate = useNavigate()


    const { user, checkUser, userOptions, selectedUser, setSelectedUser } = useContext(UserContext)

    const [mobile, setMobile] = useState(false)

    useEffect(() => {
        setSelectedUser(null)
        checkUser()
        if (window.innerWidth < 500) {
            setMobile(true)
        }
    }, [])


    return (
        <>
            {user?.uid === auth.currentUser.uid ?
                <div style={{ display: "flex" }} className={user?.uid === auth.currentUser.uid ? "show layout" : "hide layout"}>
                    {mobile ?
                        <>
                            {!selectedUser ? <div className={userOptions ? "chat-left enableBlur" : "chat-left"}>
                                <Leftnav />
                                <AllUsers />
                            </div>
                                :
                                navigate("/chat")
                                }
                        </>
                        :
                        <>
                            <div className={userOptions ? "chat-left enableBlur" : "chat-left"}>
                                <Leftnav />
                                <AllUsers />
                            </div>

                            <div className="chat-right">
                                <Chat />
                            </div>
                        </>
                    }
                </div>
                :

                <h1 className={user?.uid != auth.currentUser?.uid ? "show" : "hide"}>
                    LOADING
                </h1>}
        </>
    )
}
