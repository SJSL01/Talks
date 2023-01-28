import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Components/Landing";
import Layout from "./Components/Layout";
import Protected from "./Components/Protected";
import { UserContextProvider } from "./Context/UserContext";
import { ToastContextProvider } from "./Context/ToastContext";



function App() {

  return (

      <BrowserRouter>

        <ToastContextProvider>
          <UserContextProvider>



            <Routes>
              <Route path="/" element={<Landing />} />

              <Route path="/chat" element={<Protected><Layout /> </Protected>} />

            </Routes>


          </UserContextProvider>
        </ToastContextProvider>

      </BrowserRouter>

  );
}

export default App;
