import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ForgetPass from "./ForgetPass";

export default function Login() {
  const [info, setInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);
  const [login, setLogin] = useState();
  // const atempt = useRef(0)

  const navigate = useNavigate();
  useEffect(() => {
    get_login();
    // if (localStorage.error == "true"){
    //   setError(true)
    // }
  }, []);
  const get_login = async () => {
    try {
      let res = await axios.get("/api/login");
      setLogin(res.data.user);
      console.log(res.data.user);
      if (res.data.user != null) {
        console.log("user log in");
        setLogin(true);
      } else {
        setLogin(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    
    if (info.email !== "" && info.password !== "") {
      try {
        let res = await axios.post("/api/login", info);
        console.log(res.data);  
        if (res.data.user == null) {
          // atempt.current = atempt.current + 1
          // if (atempt.current >= 2 ) {
          //   localStorage.error = true
          //   window.location.reload()
          // }
          setError(true);

          console.log("condition");
        } else {
          navigate("/");
          window.location.reload();
          console.log("else");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Tous les champs sont obligatoire !");
    }
  };
  const handleChange = ({ target }) => {
    setInfo({ ...info, [target.name]: target.value });
  };
  return (
    <>
      {login ? (
        navigate("/")
      ) : (
        <div className="form-box">
          <form
            className="form"
            method="POST"
            onSubmit={(e) => handleSubmit(e)}
          >
            <span className="title">LOG IN</span>
            {/* <span className="subtitle">Create a free account with your email.</span>  */}
            {/* {% if error %} */}
            {error && (
              <div className="">
                <p className="text-danger">Email or password is incorrect ! </p>
              </div>
            )}
            {/* {% endif %} */}
            <div className="form-container">
              <input
                type="email"
                className="input"
                placeholder="Email"
                name="email"
                onChange={(e) => handleChange(e)}
              />
              <input
                type="password"
                className="input"
                placeholder="Password"
                name="password"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <button type="submit">Connexion</button>
          </form>
          {/* <div className="form-section" >
              <p>
                 
              </p>
            </div> */}
          <div className="form-section">
            <p>
              did you forget your password ?{" "}
              <Link to={"/forgetPassword"}> mot de pass oublie </Link>
              <br />
              You don't have an account? <Link to={"/singup"}>
                Sign up
              </Link>{" "}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
