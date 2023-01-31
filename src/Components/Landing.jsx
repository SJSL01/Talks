import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useContext, useState } from "react";
import { useAuthState, useSendEmailVerification } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { SigninWithGoogle } from "../Auth";
import { auth, db, storage } from "../firebase";
import avatar from "../Assests/avatar.png"
import "../Styles/Landing.css"
import ToastContext from "../Context/ToastContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";


export default function Landing() {

    const { toast } = useContext(ToastContext)

    const [userInfo, setUserInfo] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        userAvatar: ""
    })


    const handleinput = (e) => {
        const { name, value } = e.target
        setUserInfo({ ...userInfo, [name]: value })
    }

    const handleLogin = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            const res = await signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
            //////console.log(res);
            if (!res.user.emailVerified) {
                toast("Please Verify Your Email To Continue")
                setLoading(false)
            } else {
                toast.success("Loggin' In")
                navigate("/chat", { replace: true })
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            ////console.log(error.message);
            if (error.message === "Firebase: Error (auth/user-not-found).") {
                toast.error(`No user exists with ${userInfo.email}`)
            }
        }
    }
    //SIGNUP
    const handleSignUp = async (e) => {
        setLoading(true)
        e.preventDefault()
        const file = userInfo.userAvatar

        try {

            //Create user
            const res = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password);

            //Create a unique image name
            const storageRef = ref(storage, `${res.user.uid}`);

            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try {
                        //Update profile
                        await updateProfile(res.user, {
                            photoURL: downloadURL,
                        });
                        //create user on firestore
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            username: userInfo.username,
                            email: res.user.email,
                            photoURL: downloadURL,
                        });

                        //create empty user chats on firestore
                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        //////console.log(auth.currentUser);
                        await sendEmailVerification()
                        toast.success("You are onboard!!!! Confirm Mail Now 👍🏻")
                        setLoading(false)
                        setSignup(false)
                        setShowPsd(false)
                        navigate("/")

                    }
                    catch (error) {
                        setLoading(false)
                        //////console.log(error);
                    }

                });
            });
        } catch (error) {
            setLoading(false)
            //////console.log(error);
            if (error.message === "Firebase: Error (auth/email-already-in-use).") {
                toast.error(`${userInfo.email} already exists`)
            }
        }
    }

    const [err, setErr] = useState(false)

    const checkPassword = () => {
        if (userInfo.confirmPassword === "") return
        if (userInfo.password !== userInfo.confirmPassword) {
            setErr(true)
        } else setErr(false)
    }

    const [showPsd, setShowPsd] = useState(false)
    const [signUp, setSignup] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const [loggedIn] = useAuthState(auth)
    //////console.log(loggedIn);

    const [sendEmailVerification] = useSendEmailVerification(auth);

    // GOOGLE LOGIN

    const handleSignIn = async (e) => {
        e.preventDefault()
        try {
            const res = await SigninWithGoogle()
            //////console.log(res);
        } catch (error) {
            //////console.log(error);
        }
    }



    return (
        <>
            {!loggedIn?.emailVerified ? <div style={{ display: "flex" }} className="landing-container show" >
                <div className="left">
                    <h1>
                        TALKS
                    </h1>
                </div>
                <div className="right">

                    <div className={loading ? "card loading" : "card"}>
                        <h1>{signUp ? "SIGNUP" : "LOGIN"}</h1>

                        <form style={{ position: "relative" }} className={signUp ? "hide" : "show"}>
                            <div>
                                <input className="input" value={userInfo.email} type="email" onChange={(e) => { handleinput(e) }}
                                    name="email" placeholder="email" />
                            </div>

                            <div>
                                <input className="input" value={userInfo.password} type={showPsd ? "text" : "password"} onChange={(e) => { handleinput(e) }}
                                    name="password" placeholder="password" />
                                <span onClick={() => { setShowPsd(!showPsd) }} style={{ position: "absolute", right: "-3vh", cursor: "pointer" }}>{showPsd ? "👀" : "🙄"}</span>
                            </div>

                            <div style={{ marginTop: "3vh" }}>
                                <button className="button" disabled={loading || userInfo.email === "" || userInfo.password == ""}
                                    onClick={handleLogin} style={{ margin: "2vh 0" }} >LOGIN</button>
                            </div>

                            <div>
                                <small style={{ margin: "2vh 0" }}>Don't Have An Account? <u onClick={() => {
                                    setUserInfo({
                                        email: "",
                                        username: "",
                                        password: "",
                                        confirmPassword: "",
                                        userAvatar: ""
                                    })
                                    setSignup(true)
                                    setShowPsd(false)
                                }}>SIGNUP</u></small>
                            </div>

                            <div>
                                <button className="google-btn button" disabled={loading} onClick={handleSignIn}>Login With &nbsp; <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="5vh" height="5vh"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg></button>
                            </div>
                        </form>


                        {/* SIGNUP */}

                        <form style={{ position: "relative" }} className={signUp ? "show" : "hide"}>
                            <div>
                                <input className="input" value={userInfo.email} type="email" onChange={(e) => { handleinput(e) }}
                                    name="email" placeholder="email" />
                            </div>

                            <div>
                                <input className="input" value={userInfo.username} type="text" onChange={(e) => { handleinput(e) }}
                                    name="username" placeholder="username" />
                            </div>

                            <div >
                                <input value={userInfo.password} type="password"
                                    className={err ? "error input" : "input"}
                                    onChange={(e) => { handleinput(e) }}
                                    onBlur={checkPassword}
                                    name="password" placeholder="password"
                                    onPaste={(e) => { e.preventDefault() }} />

                                <span onClick={() => { setShowPsd(!showPsd) }} style={{ position: "absolute", right: "-3vh", top: "21vh", cursor: "pointer" }}>{showPsd ? "👀" : "🙄"}</span>
                            </div>

                            <div>
                                <input value={userInfo.confirmPassword} onPaste={(e) => { e.preventDefault() }}
                                    type={showPsd ? "text" : "password"} className={err ? "error input" : "input"}
                                    onBlur={checkPassword} onChange={(e) => { handleinput(e) }}
                                    name="confirmPassword" placeholder="confirm password" />
                            </div>

                            <div style={{ marginTop: "3vh" }}>
                                <label htmlFor="userAvatar"><small>Select An Avatar</small> <img className="avatar" src={!userInfo.userAvatar ? avatar : userInfo.userAvatar} /></label>
                                <input accept="image/*" onChange={(e) => { setUserInfo({ ...userInfo, userAvatar: e.target.files[0] }); }} style={{ display: "none" }} type="file" id="userAvatar" />
                            </div>

                            <div >
                                <button className="button" disabled={err || userInfo.password === "" || userInfo.confirmPassword === ""}
                                    onClick={handleSignUp}

                                    style={loading ? { cursor: "not-allowed", margin: "2vh 0" } : { margin: "2vh 0" }} >Sign Up</button>
                            </div>


                            <div>
                                <small style={{ margin: "2vh 0" }}>Already Have An Account? <u onClick={() => {
                                    setUserInfo({
                                        email: "",
                                        username: "",
                                        password: "",
                                        confirmPassword: "",
                                        userAvatar: ""
                                    })
                                    setSignup(false)
                                    setShowPsd(false)
                                }}>LOGIN</u></small>
                            </div>

                        </form>


                    </div>

                </div>


            </div >
                :
                navigate("/chat", { replace: true })
            }
        </>
    )
}
