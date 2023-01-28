
import { Button } from "@mui/material"
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useContext, useEffect, useRef, useState } from "react"
import UserContext from "../Context/UserContext"
import { db, storage } from "../firebase"
import "../Styles/Chat.css"
import { format } from "timeago.js"

import { uuidv4 } from "@firebase/util"

export default function Chat() {

    const view = useRef()

    const { user, selectedUser, messages, setMessages } = useContext(UserContext)

    useEffect(() => {
        setMessages([])
        console.log(selectedUser?.username);
    }, [selectedUser])

    useEffect(() => {
        view.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    const [text, setText] = useState("")
    const [media, setMedia] = useState(null)

    const handleSend = async () => {
        const roomId = selectedUser?.uid > user?.uid ? selectedUser?.uid + user?.uid : user?.uid + selectedUser?.uid


        if (media) {

            const storageRef = ref(storage, uuidv4());

            const uploadTask = uploadBytesResumable(storageRef, media);

            console.log(media);
            console.log(uploadTask);
            uploadTask.on(
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        console.log(downloadURL);
                        await updateDoc(doc(db, "chat", roomId), {
                            messages: arrayUnion({
                                text,
                                senderId: user.uid,
                                receiverId: selectedUser.uid,
                                date: Date.now(),
                                img: downloadURL,
                            }),
                        });
                    });
                }
            );


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

    console.log(messages);

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
                                {message.img && <img style={{ height: "50vh", width: "50vh" }} src={message.img} alt="" />}
                            </p>
                        )
                    })}
                    <div ref={view}></div>
                </div>


                <div className="send">


                    <input type="text" onKeyDown={(e) => { e.code === "Enter" && handleSend() }} value={text} onChange={(e) => { setText(e.target.value) }} />

                    <div style={{ marginTop: "3vh" }}>

                        <label htmlFor="media">

                            <span>📎</span>

                        </label>

                        <input accept="image/*" onChange={(e) => setMedia(e.target.files[0])} style={{ display: "none" }}
                            type="file" id="media" />

                    </div>


                    <button onClick={handleSend}>✔</button>


                </div>
            </>
                :
                <h1>SELECT A USER TO CHAT</h1>
            }

        </div>
    )
}
