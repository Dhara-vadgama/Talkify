import React from "react";
import "./landing.css";
import { Link, useNavigate } from "react-router-dom";

const features = [
  { icon: "📹", title: "HD Video", desc: "Crystal clear video calls with adaptive quality" },
  { icon: "🔒", title: "Secure", desc: "End-to-end encrypted conversations" },
  { icon: "⚡", title: "Low Latency", desc: "Ultra-fast connections worldwide" },
  { icon: "👥", title: "Group Calls", desc: "Host meetings with up to 100 participants" },
];

export default function LandingPage() {
  const router = useNavigate();

  return (
    <div className="landingPageContainer">
      {/* Navbar */}
      <div className="navHeader">
        <nav>
          <Link to="/" className="navBrand">
            <div className="navBrandIcon">📹</div>
            <h2>Talkify</h2>
          </Link>
          <div className="navlist">
            <p onClick={() => router("/auth")}>Sign In</p>
            <Link to="/auth" className="navGetStarted">Get Started</Link>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <div className="landingMainContainer">
        <div className="heroTextSection">
          <h1>
            Video calls made <span>simple</span>
          </h1>
          <p>
            Connect with anyone, anywhere. High-quality video meetings with
            one click — no downloads required.
          </p>
          <div className="heroBtnGroup">
            <Link to="/auth" className="startButton">Start a Meeting</Link>
            <Link to="/auth" className="loginButton">Sign In</Link>
          </div>
        </div>

        <div className="heroImageSection">
          <img src="/mobile.png" alt="Video calling illustration" />
        </div>
      </div>

      {/* Features */}
      <div className="featuresSection">
        <div className="featuresGrid">
          {features.map((f) => (
            <div className="featureCard" key={f.title}>
              <div className="featureIconWrap">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
