import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Welcome from "./pages/Welcome";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import PlayLayout from "./layouts/PlayLayout";
import PlayXiangqi from "./pages/PlayXiangqi";
import Play from "./pages/Play";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Game from "./pages/Game";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Main Website Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />   
        </Route>

        {/* Auth Pages */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* Play Pages (with sidebar) */}
        <Route element={<PlayLayout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/play" element={<Play />} />
          <Route path="/play-xiangqi" element={<PlayXiangqi />} />
          <Route path="/puzzles" element={<div className="p-8"><h1 className="text-2xl font-bold">Puzzles Page</h1></div>} />
          <Route path="/lessons" element={<div className="p-8"><h1 className="text-2xl font-bold">Lessons Page</h1></div>} />
          <Route path="/inbox" element={<div className="p-8"><h1 className="text-2xl font-bold">Inbox Page</h1></div>} />
          <Route path="/play-xiangqi/play/game" element={<Game />} />
          
          {/* Submenu routes */}
          <Route path="/play-xiangqi/play" element={<Play />} />
          <Route path="/play-computer" element={<div className="p-8"><h1 className="text-2xl font-bold">Play Computer</h1></div>} />
          <Route path="/watch-games" element={<div className="p-8"><h1 className="text-2xl font-bold">Watch Games</h1></div>} />
          <Route path="/tournaments" element={<div className="p-8"><h1 className="text-2xl font-bold">Tournaments</h1></div>} />
          <Route path="/leaderboard" element={<div className="p-8"><h1 className="text-2xl font-bold">Leaderboard</h1></div>} />
          <Route path="/saved-games" element={<div className="p-8"><h1 className="text-2xl font-bold">Saved Games</h1></div>} />
          <Route path="/game-history" element={<div className="p-8"><h1 className="text-2xl font-bold">Game History</h1></div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;