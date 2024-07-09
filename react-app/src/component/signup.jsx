import axios from "axios";
import React, { useEffect, useState } from "react";
import PasswordChecklist from "react-password-checklist";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const navigator = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState({ email: false, submit: true  , response : ""});
  const [info, setInfo] = useState({
    nom: "",
    prenom: "",
    tele: "",
    email: "",
    password: "",
    password1: "",
  });
  useEffect(() => {
    fetch_user();
  }, []);

  const fetch_user = async () => {
    try {
      let res = await axios.get("/users");
      // res.headers.setAuthorization()
      setUsers(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChnage = ({ target }) => {
    setInfo({ ...info, [target.name]: target.value.replace(/\s/g, '') });
    console.log(info);
    // check if email is already exist
    if (target.name === "email") {
      let emails = users.filter((e) => e.email === target.value);
      if (emails.length >= 1) {
        setError({ ...error, email: true });
      } else {
        setError({ ...error, email: false, submit: false });
      }
    }
  };
  // let checkForm  = () => {
  //   if (info.email = " )
  // }
  // chek if password fields match

  // let checkPassword = ({target}) => {
  //   if (target.name == "password" && info.password1 != "") {
  //     if (info.password != info.password1) {
  //       setError({...error , password : true})
  //     } else {
  //       setError({...error , password : false})
  //     }
  //   } else {
  //     if (info.password != info.password1) {
  //       setError({...error , password : true})
  //     } else {
  //       setError({...error , password : false})
  //     }
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      info.email !== "" &&
      info.prenom !== "" &&
      info.nom !== "" &&
      info.password !== ""
    ) {
      try {
        let res = await axios.post("/signup", info);
        console.log(res.data);
        if (res.data.messege  === "ok") {
          alert(`Email verification send to ${info.email}`)
          // localStorage.setItem("token", res.data.token);
          // navigator("/login");
          navigator('/mail_verify')
        }
      } catch (error) {
        console.log(error);
        setError({...error , response : error.response.data.error})
      }
    } else {
      alert("Touts les chmaps sont obligatoire !");
    }
  };
  return (
    <>
      <div className="form-box">
        <form className="form" method="POST" onSubmit={(e) => handleSubmit(e)}>
          <span className="title">Sign In</span>
          <span className="subtitle">
            Create a free account with your email.
          </span>
          {/* {% if error %} */}
            <span className="subtitle text-danger">{/*{error} */}</span>
            {/* {% endif %} */}
          <div className="form-container">
            <input
              type="text"
              className="input"
              onChange={(e) => handleChnage(e)}
              placeholder="Nom"
              name="nom"
            />
            <input
              type="text"
              className="input"
              onChange={(e) => handleChnage(e)}
              placeholder="Prenom"
              name="prenom"
            />
            <input
              type="text"
              className="input"
              onChange={(e) => handleChnage(e)}
              placeholder="Numero Telephone. Exemple : 0655112233"
              name="tele"
            />
            <input
              type="email"
              className="input"
              onChange={(e) => handleChnage(e)}
              placeholder="Email"
              name="email"
            />
            {error.email ? (
              <span className="text-danger">Email already exist</span>
            ) : (
              ""
            )}
            <input
              type="password"
              className="input"
              onChange={(e) => handleChnage(e)}
              placeholder="Password"
              name="password"
            />
            <input
              type="password"
              className="input"
              onChange={(e) => handleChnage(e)}
              placeholder="Password Confirmation"
              name="password1"
            />
            {info.password !== "" ? (
              <PasswordChecklist
                rules={["minLength", "specialChar", "match"]}
                minLength={5}
                value={info.password}
                valueAgain={info.password1}
                // onChange={(isValid) => {
                //   if (isValid == true) {
                //     setError({ ...error, email: false });
                //   }
                // }}
              />
            ) : (
              ""
            )}
          </div>
          <button type="submit">Connexion</button>
        </form>
      </div>
    </>
  );
}
