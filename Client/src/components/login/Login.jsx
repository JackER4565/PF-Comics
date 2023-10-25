/* eslint-disable no-irregular-whitespace */
import styles from "./Login.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleAuth } from "../../redux/features/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../navbar/Navbar";

function Login() {
  const logState = useSelector((state) => state.user.logState);
  const userActive = useSelector((state) => state.user.user);
  if (logState && userActive && userActive.active !== false) window.location.href = "/home";

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [res, setRes] = useState("");

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
    if (res) setRes("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (res) setRes("");
    if (data.email.length < 3) {
      setRes("Email must be at least 3 characters long");
      return;
    } else if (!data.email.includes("@")) {
      setRes("Email must be valid");
      return;
    }
    if (data.password.length < 3) {
      setRes("Password must be at least 3 characters long");
      return;
    }
    if (!data.password.match(/[0-9]/g)) {
      setRes("Password must contain at least one number");
      return;
    }
    if (!data.password.match(/[A-Z]/g)) {
      setRes("Password must contain at least one uppercase");
      return;
    }
    setRes("Loading...");
    dispatch(loginUser(data))
      .then((res) => {
        if (res.error) {
          setRes(res.payload);
          return;
        }
        if (res.payload.active === false) {
          toast.error("User is not active");
          setRes("User is not active");
          return;
        }
        setRes("Success");
        localStorage.setItem("userlog", JSON.stringify(res.payload)); //TODO agregar userlog
      })
      .catch((err) => {
        if (err.response && err.response.data)
          setRes(err.response.data.message);
        else setRes("Error in server");
      });
  };

  const responseGoogle = async (response) => {
    dispatch(googleAuth(response))
      .then((res) => {
        if (res.error) {
          setRes(res.payload);
          return;
        }
        if (res.payload.active === false) {
          toast.error("User is not active");
          setRes("User is not active");
          return;
        }
        setRes("Success");
        localStorage.setItem("userlog", JSON.stringify(res.payload)); //TODO agregar userlog
      })
      .catch((err) => {
        if (err.response && err.response.data)
          setRes(err.response.data.message);
        else setRes("Error in server");
      });
  };

  return (
    <>
    <Navbar/>
    <div className={styles.container}>
      <h2>LogIn</h2> <hr />
      <h3
        onClick={() => setRes("")}
        style={{
          cursor: "pointer",
          color: "red",
        }}
      >
        {res ? <>&times; {res} &times;</> : null} 
      </h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="email" className={styles.label}>
          Email <label style={{ color: "red" }}>*</label>
        </label>
        <input
          type="email"
          id="email"
          value={data.email}
          onChange={handleChange}
          className={styles.input}
        />
        <label htmlFor="password" className={styles.label}>
          Password <label style={{ color: "red" }}>*</label>
        </label>
        <input
          type="password"
          id="password"
          value={data.password}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="submit" className={styles.submit}>
          Login
        </button>

        <GoogleLogin
          className={styles.googleButton}
          size="3rem"
          onSuccess={(credentialResponse) => {
            responseGoogle(credentialResponse);
          }}
          onError={() => {
            setRes("Login Failed");
          }}
        />
        <br />
      </form>
    </div>
    </>
  );
}

export default Login;
