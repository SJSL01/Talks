
import { auth } from "./firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"


export const provider = new GoogleAuthProvider();


export const SigninWithGoogle = async () => {
    try {
        await signInWithPopup(auth, provider)
        return true

    } catch (error) {
        alert(error)
    }
}
