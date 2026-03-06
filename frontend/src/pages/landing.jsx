import React from "react";
import "./landing.css";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
    const router = useNavigate();
    return (
        <div className="landingPageContainer">
            <nav>
                <div className="navHeader">
                    <h2>Talkify</h2>
                </div>
                <div className="navlist">
                    <p
                        onClick={() => {
                            router("/d19e2h45");
                        }}
                    >
                        Join as Guest
                    </p>
                    <p
                        onClick={() => {
                            router("/auth");
                        }}
                    >
                        Register
                    </p>
                    <div role="button">
                        <Link to={"/auth"} className="loginButton">
                            Login
                        </Link>
                    </div>
                </div>
            </nav>
            <div className="landingMainContainer" id="main">
                <div>
                    <h1>
                        <span style={{ color: "#ff9839" }}>Connect</span> with
                        your loved Ones
                    </h1>
                    <p>Cover a distance by Talkify</p>
                    <div role="button">
                        <Link to={"/auth"} className="startButton">
                            Get Started
                        </Link>
                    </div>
                </div>
                <div>
                    <img src="/mobile.png" alt="phone_image"></img>
                </div>
            </div>
        </div>
    );
}
