
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Components/Landing";
import Layout from "./Components/Layout";
import Protected from "./Components/Protected";
import { ToastContextProvider } from "./Context/ToastContext";


function App() {




  return (
    <BrowserRouter>

      <ToastContextProvider>

        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/chat" element={<Protected><Layout /> </Protected>} />

        </Routes>

      </ToastContextProvider>

    </BrowserRouter>

  );
}

export default App;
