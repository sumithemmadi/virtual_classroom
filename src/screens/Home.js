import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import { auth, signInWithGoogle } from "../firebase";
import "./Home.css";
import Logo from "./images/google-classroom-icon.svg";
import G_logo from "./images/icons8-google.svg";

function Home() {
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();

  useEffect(() => {
    if (loading) return;
    if (user) history.push("/dashboard");
  }, [loading, user,history]);

  return (
    <div className="main">
      <div className="home_session">
        <nav className="nav-bar">
          <div className="logo-container">
            <img
              src={Logo}
              className="logo"
              alt="logo"
              height={40}
              width={40}
            />
            <h1 className="head_name">Virtual Classroom</h1>
          </div>
          <button className="button" onClick={signInWithGoogle}>
            Sign in
          </button>
        </nav>

        <div className="App-home">
          <div className="home-message">
            <h1>Where teaching and learning come together</h1>
            <p>
              Virtual Classroom is your all-in-one place for teaching and
              learning. Our easy-to-use and secure tool helps educators manage,
              measure, and enrich learning experiences.
            </p>
            <div className="btn-class">
              <button className="button" onClick={signInWithGoogle}>
                Get Started
              </button>
              <button className="button login-btn" onClick={signInWithGoogle}>
                <img src={G_logo} alt="google logo" className="google-logo" />
                <span>Sign in to Classroom</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    // <div className="home">
    //   <div className="home__container">
    //     <img
    //       src="https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Classroom_Logo.png"
    //       alt="Google Classroom Image"
    //       className="home__image"
    //     />
    //     <button className="home__login" onClick={signInWithGoogle}>
    //       Login with Google
    //     </button>
    //   </div>
    // </div>
  );
}

export default Home;
