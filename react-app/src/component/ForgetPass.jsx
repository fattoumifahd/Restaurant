import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgetPass() {
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getEmails();
  }, []);

  const handleChange = ({ target }) => {
    const checkMailExists = emails.filter((e) => e == target.value);
    if (checkMailExists.length <= 0) {
      setError(true);
    } else {
      setEmail(target.value);
      setError(false);
    }
  };
  const getEmails = async () => {
    try {
      const res = await axios.get("/users");
      let mails = [];
      // console.log(res.data);
      res.data.map((e) => mails.push(e.email));

      setEmails(mails);

      // console.log(emails)
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const req = await axios.post("/forget_pass", { email: email });
      console.log(req.data);
      if (req.data.message == "ok") {
        alert("Password reset link sent to your email");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="form-box">
      {/* {console.log(emails)} */}
      <form className="form" method="POST" onSubmit={(e) => handleSubmit(e)}>
        <span className="title">Mot de passe oublie</span>
        {error && (
          <div className="">
            <p className="text-danger">Email is not exits ! </p>
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
        </div>
        {email != "" && (
          <button className="btn-primary" disabled={error}>
            oublie mot de pass
          </button>
        )}
      </form>
    </div>
  );
}
