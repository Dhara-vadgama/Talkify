import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandingPage from "./pages/landing";
import Authentication from "./pages/Authentication";
import { AuthProvider } from "./context/authContext";
import VideoMeet from "./pages/videoMeet";
import History from "./pages/History";
import HomeComponent from "./pages/home";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path='/home's element={<HomeComponent />} />
            <Route path="/:url" element={<VideoMeet />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
