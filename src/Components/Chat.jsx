import { Button } from "@mui/material"
import { useContext } from "react"
import UserContext from "../Context/UserContext"
import "../Styles/Chat.css"
export default function Chat() {

    const { selectedUser } = useContext(UserContext)


    return (
        <div className="chat-container">
            <div className="chat-top">
                <div>
                    {selectedUser && <h1>{selectedUser?.username}</h1>}
                </div>
                <div className="chat-avatar">
                    <img src={selectedUser?.photoURL} alt="" />
                </div>

            </div>
            <div className="text-area">
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
                <p>hello</p>
            </div>
            <div className="send">
                <input type="text" />
                <Button variant="contained">✔</Button>
            </div>
        </div>
    )
}
