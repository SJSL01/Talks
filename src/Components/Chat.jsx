
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

    const [text, setText] = useState("")
    const [media, setMedia] = useState(null)
    const view = useRef()
    const inp = useRef()

    const [uploading, setUploading] = useState(null)

    const { user, selectedUser, messages, setMessages, setSelectedUser } = useContext(UserContext)



    useEffect(() => {
        // setMessages([])
    }, [selectedUser])

    useEffect(() => {
        view.current?.scrollIntoView({ behavior: "smooth" });
    }, [media, messages])

    const cloud = useRef()
    const widgetRef = useRef()

    useEffect(() => {

        cloud.current = window.cloudinary
        widgetRef.current = cloud.current.createUploadWidget({
            cloudName: process.env.REACT_APP_CLOUD_NAME,
            uploadPreset: "gyogibwu",
            cropping: true, //add a cropping step
            // showAdvancedOptions: true, //add advanced options (public_id and tag)
            sources: ["local", "camera"], // restrict the upload sources to URL and local files
            // multiple: false,  //restrict upload to a single file
            folder: user.displayName, //upload files to the specified folder
            // tags: ["users", "profile"], //add the given tags to the uploaded files
            // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
            // clientAllowedFormats: ["images"], //restrict uploading to image files only
            // maxImageFileSize: 2000000 //restrict file size to less than 2MB
            // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
            theme: "purple" //change to a purple theme
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

                                    <div>
                                        {message.img && <img style={{ width: "100%" }} src={message.img} alt="" />}
                                    </div>

                                    <div className="text" >
                                        {message.text}
                                    </div>
                                    <div>
                                        <small style={{ fontSize: ".9vh" }}>{format(message.date)}</small>
                                    </div>

                                </div>
                                <div>

                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                                        <img src={message.senderId === user.uid ? user.photoURL : selectedUser.photoURL}
                                            style={{ height: "5vh", width: "5vh", borderRadius: "50%" }} alt="" />
                                        <small style={{ fontSize: "1.5vh" }}>{message.senderId === user.uid ? "ME" : selectedUser.username}</small>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {uploading && <div className="disableBlur">{uploading}</div>}
                    {media &&
                        <div ref={view} className="my disableBlur">
                            <img src={media} alt="" />
                        </div>}
                    <div ref={view}></div>
                </div>


                <div className="send">


                    <div>
                        <textarea ref={inp} type="text" onKeyDown={(e) => { e.code === "Enter" && handleSend() }} value={text} onChange={(e) => { setText(e.target.value) }} />
                    </div>


                    <div>
                        <span onClick={() => { widgetRef.current.open() }}>📎</span>


                        {/* <label htmlFor="media">

                            <span>📎</span>

                        </label>

                        <input accept="image/*" onChange={(e) => setMedia(e.target.files[0])} style={{ display: "none" }}
                            type="file" id="media" /> */}

                        <button
                            style={{ marginR: "0 5vh", backgroundColor: "lightgreen" }}
                            onClick={() => { handleSend() }}>Send✔</button>
                    </div>



                </div>
            </>
                :
                <h1>SELECT A USER TO CHAT</h1>
            }

        </div>
    )
}
