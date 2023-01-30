import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { auth, db } from "../firebase";
import ToastContext from "./ToastContext";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {


    const { toast } = useContext(ToastContext)

    const [user, setUser] = useState(null)

    const [search, setSearch] = useState(null)

    const [searchedUser, setSearchedUser] = useState(null)

    const [userOptions, setUserOptions] = useState(false)

    const [selectedUser, setSelectedUser] = useState(null)

    const [messages, setMessages] = useState([])


    const checkUser = async () => {
        setSearch(null)
        setSearchedUser(null)
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setUser(docSnap.data())
        } else {
            save()
            //console.log("No such document!");
        }
    }

    const save = async () => {
        //console.log("gooGle");
        try {
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                uid: auth.currentUser.uid,
                username: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL
            });
            await setDoc(doc(db, "userChats", auth.currentUser.uid), {});

        } catch (error) {
            //console.log(error);
        }
    }

    // debounce search
    useEffect(() => {

        if (search != "" && search != null) {

            let timer = setTimeout(() => {
                searchUser()
            }, 1000)

            return () => clearInterval(timer)
        }

    }, [search])


    const searchUser = async () => {
        setSearchedUser(null)
        if (search === user.username && search === null) {
            return
        }
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", search));
        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length === 0) {

                toast.error(`No User Found With ${search} username`)

                return
            }

            querySnapshot.forEach((doc) => {
                setSearchedUser(doc.data())
                //console.log(doc.data());
            });

        } catch (error) {
            setSearchedUser(null)
            //console.log(error);
        }
    }


    const checkIfConvoExists = async () => {

        const roomId = searchedUser.uid > user.uid ? searchedUser.uid + user.uid : user.uid + searchedUser.uid
        //console.log(roomId);
        try {
            const res = await getDoc(doc(db, "chat", roomId))

            if (!res.exists()) {
                await setDoc(doc(db, "chat", roomId), { messages: [] })


                // make chat from current user
                await updateDoc(doc(db, "userChats", user.uid), {
                    [roomId + ".userInfo"]: {
                        uid: searchedUser.uid,
                        username: searchedUser.username,
                        photoURL: searchedUser.photoURL,
                    },
                    [roomId + ".date"]: serverTimestamp()

                })

                // make chat from searched new user
                await updateDoc(doc(db, "userChats", searchedUser.uid), {
                    [roomId + ".userInfo"]: {
                        uid: user.uid,
                        username: user.username,
                        photoURL: user.photoURL,
                    },
                    [roomId + ".date"]: serverTimestamp()

                })

            }
            setSearchedUser(null)
            setSearch(null)

        } catch (error) {
            //console.log(error);
        }
    }



    useEffect(() => {

        if (selectedUser) {
            const roomId = selectedUser?.uid > user?.uid ? selectedUser?.uid + user?.uid : user?.uid + selectedUser?.uid
            // //console.log(roomId);
            const unSub = onSnapshot(doc(db, "chat", roomId), (doc) => {
                doc.exists() && setMessages(doc.data().messages)
            })

            return () => {
                unSub()
            }
        }
    }, [selectedUser])

    // //console.log(messages);



    return (
        <UserContext.Provider value={{
            user, setUser,
            checkUser, search,
            setSearch, searchUser,
            searchedUser, setSearchedUser,
            checkIfConvoExists,
            setUserOptions, userOptions,
            setSelectedUser, selectedUser,
            setMessages, messages
        }}>
            {children}
        </UserContext.Provider>
    )
}


export default UserContext;