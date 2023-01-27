
import { Button } from "@mui/material"
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useContext, useEffect, useState } from "react"
import UserContext from "../Context/UserContext"
import { db, storage } from "../firebase"
import "../Styles/Chat.css"
import { format } from "timeago.js"
export default function Chat() {

    const { user, selectedUser, messages, setMessages } = useContext(UserContext)


    useEffect(() => {
        setMessages([])
    }, [selectedUser])

    const [text, setText] = useState("")
    const [media, setMedia] = useState(null)

    const handleSend = async () => {
        const roomId = selectedUser?.uid > user?.uid ? selectedUser?.uid + user?.uid : user?.uid + selectedUser?.uid


        if (media) {
            console.log(media);

            const storageRef = ref(storage, Date.now());
            await uploadBytesResumable(storageRef, media).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {

                    await updateDoc(doc(db, "chat", roomId), {
                        messages: arrayUnion({
                            text,
                            media: downloadURL,
                            senderId: user.uid,
                            receiverId: selectedUser.uid,
                            date: Timestamp.now()
                        })
                    })

                });
            });


        } else {

            await updateDoc(doc(db, "chat", roomId), {
                messages: arrayUnion({
                    text,
                    senderId: user.uid,
                    receiverId: selectedUser.uid,
                    date: Date.now()
                })
            })

        }

        setMedia(null)
        setText("")
    }



    return (
        <div className="chat-container">
            {selectedUser ? <>
                <div className="chat-top">
                    <div>
                        {selectedUser && <h1>{selectedUser?.username}</h1>}
                    </div>
                    <div className="chat-avatar">
                        <img src={selectedUser?.photoURL} alt="" />
                    </div>

                </div>
                <div className="text-area">
                    {messages.map(message => {
                        return (
                            <p >
                                <span>{message.senderId === user.uid ? "ME" : selectedUser.username}</span>
                                <img src={message.senderId === user.uid ? user.photoURL : selectedUser.photoURL}
                                    style={{ height: "5vh", width: "5vh" }} alt="" />
                                {message.text}
                                <span>{format(message.date)}</span>
                            </p>
                        )
                    })}
                </div>


                <div className="send">


                    <input type="text" value={text} onChange={(e) => { setText(e.target.value) }} />

                    <div style={{ marginTop: "3vh" }}>

                        <label htmlFor="media">

                            <span>📎</span>

                        </label>

                        <input accept="image/*" onChange={(e) => setMedia(e.target.files[0])} style={{ display: "none" }}
                            type="file" id="media" />

                    </div>


                    <Button onClick={handleSend} variant="contained">✔</Button>


                </div>
            </>
                :
                <h1>SELECT A USER TO CHAT</h1>
            }

        </div>
    )
}
