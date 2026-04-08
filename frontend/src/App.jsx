import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandingPage from "./pages/landing";
import Authentication from "./pages/Authentication";
import { AuthProvider } from "./context/authContext";
import VideoMeet from "./pages/videoMeet";
import History from "./pages/History";
import HomeComponent from "./pages/home";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
        <Toaster />
       
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path='/home' element={<HomeComponent />} />
           
            <Route path="/history" element={<History />} />
            <Route path="/:url" element={<VideoMeet />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
