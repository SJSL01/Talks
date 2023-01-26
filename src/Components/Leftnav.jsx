import { Button } from '@mui/material'
import { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../Context/UserContext';
import { auth } from '../firebase';

import "../Styles/Leftnav.css"

export default function Leftnav() {



    const { user, setUser, search,
        setSearch, searchUser,
        searchedUser, setSearchedUser,
        userOptions, setUserOptions } = useContext(UserContext)

    const navigate = useNavigate();



    return (
        <>
            <div className='left-nav disableBlur'>


                <div onClick={() => { setUserOptions(!userOptions) }} className='avatar-container'>
                    <img style={{ cursor: "pointer" }} src={user?.photoURL} alt="" />
                </div>

                <div className={userOptions ? "hideUserName" : "showUserName"}
                 onClick={() => { setUserOptions(!userOptions) }}
                    style={{ margin: "0 1vh", cursor: "pointer" }}>
                    {user?.username}
                </div>

                <input style={{ margin: "0" }}
                    type="text" placeholder='Search a User'
                    value={search === null ? "" : search} onKeyDown={(e) => { e.code === "Enter" && searchUser() }}
                    onChange={(e) => {
                        if (searchedUser) setSearchedUser(null)
                        setSearch(e.target.value)
                    }} />

            </div >

            <div className={userOptions ? "options disableBlur" : "disableOptions"}>
                <div>
                    {user?.username}
                </div>
                <div>

                    <Button variant="contained" color="error"
                        onClick={() => {
                            setUserOptions(false)
                            setSearchedUser(null)
                            setUser(null)
                            auth.signOut()
                            navigate("/", { replace: true })
                        }}>SIGNOUT</Button>
                </div>
                <div>

                    <Button variant="contained" color="error"
                        onClick={() => { auth.currentUser.delete() }}>DELETE</Button>

                </div>
            </div>
        </>
    )
}
