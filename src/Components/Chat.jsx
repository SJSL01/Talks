
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

    const [uploading, setUploading] = useState(null)

    const { user, selectedUser, messages, setMessages, setSelectedUser } = useContext(UserContext)

    useEffect(() => {
        setMessages([])
        //console.log(selectedUser?.username);
    }, [selectedUser])

    useEffect(() => {
        view.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    const [text, setText] = useState("")
    const [media, setMedia] = useState(null)

    const handleSend = async () => {


        if (text === "" && media === null) {
            return
        }
        const roomId = selectedUser?.uid > user?.uid ? selectedUser?.uid + user?.uid : user?.uid + selectedUser?.uid


        if (media) {

            const storageRef = ref(storage, uuidv4());

            const uploadTask = uploadBytesResumable(storageRef, media);

            //console.log(media);
            //console.log(uploadTask);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploading(progress).toFixed(0)
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        //console.log(downloadURL);
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
        setUploading(null)
        setMedia(null)
        setText("")
    }

    //console.log(messages);

    return (
        <div className="chat-container">
            {selectedUser ? <>
                <div className="chat-top">
                    <div onClick={() => { setSelectedUser(null) }}>
                        ⬅
                    </div>
                    <div>
                        {selectedUser && <h3>{selectedUser?.username}</h3>}
                    </div>
                    <div className="chat-avatar">
                        <img src={selectedUser?.photoURL} alt="" />
                    </div>

                </div>
                <div className="text-area enableBlur">
                    {messages.map(message => {
                        return (
                            <div className={message.receiverId !== user.uid ? "my disableBlur" : "disableBlur other"} >
                                <div>
                                    <img src={message.senderId === user.uid ? user.photoURL : selectedUser.photoURL}
                                        style={{ height: "2vh", width: "2vh", borderRadius: "50%" }} alt="" />
                                    <small style={{ fontSize: "1vh" }}>{message.senderId === user.uid ? "ME" : selectedUser.username}</small>
                                </div>

                                <div style={{ width: "20vh" }}>
                                    {message.img && <img style={{ width: "100%" }} src={message.img} alt="" />}
                                </div>

                                <div className="text" >
                                    {message.text}
                                </div>
                                <div>
                                    <small style={{ fontSize: ".9vh" }}>{format(message.date)}</small>
                                </div>
                            </div>
                        )
                    })}
                    {uploading && <div className="disableBlur">{uploading}</div>}
                    <div ref={view}></div>
                </div>


                <div className="send">


                    <div>
                        <textarea type="text" onKeyDown={(e) => { e.code === "Enter" && handleSend() }} value={text} onChange={(e) => { setText(e.target.value) }} />
                    </div>


                    <div>

                        <label htmlFor="media">

                            <span>📎</span>

                        </label>

                        <input accept="image/*" onChange={(e) => setMedia(e.target.files[0])} style={{ display: "none" }}
                            type="file" id="media" />

                        <button style={{ margin: "0 5vh", backgroundColor: "lightgreen" }} onClick={() => { handleSend() }}>Send✔</button>
                    </div>



                </div>
            </>
                :
                <h1>SELECT A USER TO CHAT</h1>
            }

        </div>
    )
}
