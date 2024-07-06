import axios from "axios";
import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

export default function AdminSingup() {
  const [compus, setCompus] = useState([]);
  const [error, setError] = useState({ err: false, message: "" });
  const [info, setInfo] = useState({
    login: "",
    nom: "",
    compus_id: "",
    password: "",
    ville: "",
  });
  const [eye, setEye] = useState({ eyeClose: false, eyeOpen: true });
  const naviget = useNavigate();
  //   const [ville, setVille] = useState("");
  useEffect(() => {
    getCompus();
  }, []);

  const handleChange = ({ target }) => {
    setInfo({ ...info, [target.name]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/admin/signup", info);
      console.log(res.data);
      if (res.data.message) {
        naviget("/admin/login");
      } else {
        setError({ ...error, err: true, message: res.data.error });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCompus = async () => {
    try {
      const res = await axios.get("/compus");
      setCompus(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const eyeHandler = () => {
    // setEye()
    if (eye.eyeClose == false && eye.eyeOpen == true) {
      setEye({ ...eye, eyeOpen: false, eyeClose: true });
    }
    if (eye.eyeClose == true && eye.eyeOpen == false) {
      setEye({ ...eye, eyeOpen: true, eyeClose: false });
    }
  };

  return (
    <div>
      <div className="form-box">
        <form className="form" method="POST" onSubmit={(e) => handleSubmit(e)}>
          <span className="title">ADMIN  SIGN UP</span>
          {/* <span className="subtitle">Create a free account with your email.</span>  */}
          {/* {% if error %} */}
          {error.err && (
            <div className="">
              <p className="text-danger">{error.message} </p>
            </div>
          )}
          {/* {% endif %} */}
          <div className="form-container">
            <input
              type="text"
              className="input"
              placeholder="Login"
              name="login"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="text"
              name="nom"
              className="input"
              placeholder="Nom"
              onChange={(e) => handleChange(e)}
            />
            <select
              name="ville"
              id=""
              className="form-control form-select"
              onChange={(e) => handleChange(e)}
              
            >
              <option selected defaultValue={""} disabled>
                Select City*
              </option>
              <option value="RABAT" key="1">
                Rabat
              </option>
              <option value="CASABLANCA" key="2">
                Casablanca
              </option>
              <option value="MARRAKECH" key="3">
                Marakech
              </option>
              {/* {compus.map((e,i) => {
                    <option value={e.compus_id} key={i}>{e.ville}</option>
                })} */}
            </select>
            {info.ville != "" && (
              <select
                name="compus_id"
                id=""
                className="form-control form-select"
                onChange={(e) => handleChange(e)}
              >
                <option defaultValue={""} disabled selected={"selected"}>
                  Place{" "}
                </option>
                {compus.map((c, i) => {
                  if (c.ville == info.ville) {
                    return (
                      <option value={c.compus_id} key={i}>
                        {c.place}
                      </option>
                    );
                  }
                })}
              </select>
            )}
            {/* <div className="input"> */}
            <input
              type={eye.eyeOpen ? "password" : "text"}
              className="input password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            {eye.eyeOpen && (
              <VisibilityIcon
                className="eye-open"
                name="eye-open"
                onClick={() => eyeHandler()}
              />
            )}
            {eye.eyeClose && (
              <VisibilityOffIcon
                className="eye-close"
                name="eye-close"
                onClick={() => eyeHandler()}
              />
            )}
            {/* </div> */}
          </div>
          <button type="submit">Connexion</button>
        </form>
      </div>
    </div>
  );
}
