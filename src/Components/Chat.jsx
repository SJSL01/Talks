
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useContext, useEffect, useRef, useState } from "react"
import UserContext from "../Context/UserContext"
import { db, storage } from "../firebase"
import "../Styles/Chat.css"
import { format } from "timeago.js"
import ScrollToBottom, { useScrollToBottom } from 'react-scroll-to-bottom';
import { useNavigate } from "react-router-dom"
import BG from "./BG"
import send from "../Assests/send.png"
import attach from "../Assests/attach.png"

export default function Chat() {


    const scrollToBottom = useScrollToBottom();


    const navigate = useNavigate()


    const [text, setText] = useState("")
    const [media, setMedia] = useState(null)
    const view = useRef()
    const inp = useRef()

    const [uploading, setUploading] = useState(null)

    const { user, selectedUser, messages, setMessages, setSelectedUser } = useContext(UserContext)



    const cloud = useRef()
    const widgetRef = useRef()

    useEffect(() => {

        if (user === null) navigate("/")

        cloud.current = window.cloudinary
        widgetRef.current = cloud.current.createUploadWidget({
            cloudName: process.env.REACT_APP_CLOUD_NAME,
            uploadPreset: "gyogibwu",
            sources: ["local", "camera"],
            folder: user?.displayName,
        }, (err, res) => {
            if (res.info.secure_url != undefined) {
                setMedia(res.info.secure_url)
                console.log(res);
            }
        })
        // console.log(cloud.current);
    }, [])


    const handleSend = async () => {
        inp.current.focus()

        if (text === "" && media === null) {
            return
        }
        const roomId = selectedUser?.uid > user?.uid ? selectedUser?.uid + user?.uid : user?.uid + selectedUser?.uid


        if (media) {
            console.log(media);

            await updateDoc(doc(db, "chat", roomId), {
                messages: arrayUnion({
                    text,
                    senderId: user.uid,
                    receiverId: selectedUser.uid,
                    date: Date.now(),
                    img: media,
                }),
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
        setUploading(null)
        setMedia(null)
        setText("")
        scrollToBottom()
    }

    //console.log(messages);

    return (
        <div className="chat-container">
            {selectedUser ? <>
                <div className="chat-top">
                    <div onClick={() => {
                        setSelectedUser(null)
                        setMessages([])
                        navigate("/home")
                    }}>
                        BACK
                    </div>
                    <div>
                        {selectedUser && <h3>{selectedUser?.username}</h3>}
                    </div>
                    <div className="chat-avatar">
                        <img src={selectedUser?.photoURL} alt="" />
                    </div>

                </div>
                <ScrollToBottom className="text-area">
                    {messages.map(message => {
                        return (

                            <div className={message.receiverId !== user.uid ? "my disableBlur" : "disableBlur other"} >

                                <div>

                                    <div>
                                        {message.img && <img style={{ width: "100%" }} src={message.img} alt="" />}
                                    </div>

                                    <div className="text" >
                                        {message.text}
                                    </div>
                                    <div style={message.receiverId!==user.uid?
                                    { display: "flex", justifyContent: "flex-end" }:{display: "flex", justifyContent: "flex-start"}}>
                                        <small style={{ fontSize: ".9vh" }}>{format(message.date)}</small>
                                    </div>

                                </div>
                            </div>

                        )
                    })}
                    {uploading && <div className="disableBlur">{uploading}</div>}
                    {media &&
                        <div ref={view} className="my disableBlur">
                            <img style={{ width: "100%" }} src={media} alt="" />
                            <small>{text ? text : "Press SEND to send the media"}</small>
                        </div>}
                </ScrollToBottom>


                <div className="send">

                    <div>

                        <button onClick={() => { widgetRef.current.open() }}>
                            <img style={{ width: "4vh" }} src={attach} alt="attach" />
                        </button>
                    </div>
                    <div>
                        <textarea ref={inp} type="text"
                            onKeyDown={(e) => { e.code === "Enter" && handleSend() }}
                            value={text} onChange={(e) => { setText(e.target.value) }} />
                    </div>


                    <div>

                        <button onClick={() => { handleSend() }}>
                            <img style={{ width: "4vh" }} src={send} alt="send" />
                        </button>
                    </div>



                </div>
            </>
                :
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    width: "80vw"
                }}>
                    <h1>SELECT A USER TO CHAT</h1>
                </div>
            }

            <BG />
        </div>
    )
}
