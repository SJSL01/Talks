import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Components/Landing";
import Layout from "./Components/Layout";
import Protected from "./Components/Protected";
import { UserContextProvider } from "./Context/UserContext";
import { ToastContextProvider } from "./Context/ToastContext";
import { useEffect, useState } from "react";
import Chat from "./Components/Chat";




function App() {

  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    if (window.innerWidth < 500) {
      setMobile(true)
    }
  }, [])


  return (

    <BrowserRouter>

      <ToastContextProvider>
        <UserContextProvider>



          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/home" element={<Protected><Layout /> </Protected>} />

          <Route path="/chat" element={<Protected><Chat /> </Protected>} />

          </Routes>


        </UserContextProvider>
      </ToastContextProvider>

    </BrowserRouter>

  );
}

export default App;
