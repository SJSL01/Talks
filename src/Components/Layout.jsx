
import AllUsers from './AllUsers'
import Chat from './Chat'
import Leftnav from './Leftnav'

import "../Styles/Layout.css"

export default function Layout() {


    return (
        <div className='layout'>
            <div>
                <Leftnav />
                <AllUsers />
            </div>
            <Chat />
        </div>
    )
}
