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

            <div>
                <h3 style={{ textAlign: "center", color: "white" }}>My Chats</h3>
                {Object.entries(chats).map(chat => {
                    return (
                        <div
                            style={selectedUser?.uid == chat[1].userInfo.uid ? { backgroundColor: "gray" } : {}}
                            className='myChats' onClick={() => {
                                setSelectedUser(chat[1].userInfo)
                            }}>

                            <div>
                                <img src={chat[1].userInfo.photoURL} alt="" />
                            </div>
                            <p >
                                {chat[1].userInfo.username}
                            </p>


                        </div>
                    )
                })}
            </div>
        </div >
    )
}
