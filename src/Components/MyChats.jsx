import { doc, onSnapshot, } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import UserContext from '../Context/UserContext'
import { db } from '../firebase'
import "../Styles/MyChats.css"

export default function MyChats() {

    const { user, searchedUser, checkIfConvoExists, setSelectedUser, selectedUser } = useContext(UserContext)

    const [chats, setChats] = useState([])

    useEffect(() => {

        const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
            setChats(doc.data())
        });
        return () => {
            unsub()
        }
    }, [user.uid])

    //console.log(Object.entries(chats));


    return (
        <div className='myChats-Container'>
            <div className='heading'>TALKS</div>

            {searchedUser &&
                <>
                    <h3 style={{ textAlign: "center", color: "white" }}>Searched User</h3>
                    <div className='myChats' onClick={checkIfConvoExists} >

                        <div>
                            <img src={searchedUser.photoURL} alt="" />
                        </div>
                        <p >
                            {searchedUser.username}
                        </p>
                    </div>
                </>
            }

            {searchedUser && <hr />}

            <h3 style={{ textAlign: "center", color: "white" }}>My Chats</h3>
            <div className='all-chats'>
                {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => {
                    return (
                        <div
                            style={selectedUser?.uid == chat[1].userInfo.uid ? { backgroundColor: "rgba(255, 255, 255, 0.432)" } : {}}
                            className='myChats' onClick={() => {
                                setSelectedUser(chat[1].userInfo)
                            }}>

                            <div>
                                <img referrerPolicy='no-referrer' src={chat[1].userInfo.photoURL} alt="" />
                            </div>
                            <p >
                                {chat[1].userInfo.username}
                            </p>
                            <p>
                                {chat[1].lastText}
                            </p>


                        </div>
                    )
                })}
            </div>
        </div >

    )
}
