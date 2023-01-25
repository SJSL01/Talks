
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"

export default function Protected({ children }) {

    const navigate = useNavigate()

    const [user] = useAuthState(auth)

    return (
        <>
            {user ? <>{children}</> :navigate("/") }

        </>
    )
}
