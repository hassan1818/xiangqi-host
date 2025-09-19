import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import PlayXiangqi from "./pages/PlayXiangqi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
       <ToastContainer position="top-right" autoClose={3000} />
    <Routes>
      {/* Main Website Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />   
        {/* add more main routes here */}
      </Route>

      {/* Auth Pages (no header/footer, full background) */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/play-xiangqi" element={<PlayXiangqi />} />
      </Route>
       
    </Routes>
    </>
    
  );
}

export default App;
