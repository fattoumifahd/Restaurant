import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    
    const [error , setError] = useState({err : false, message : ""});
    const [info , setInfo] = useState({login : "" , password : ""})
    const navigat = useNavigate();
  const handleChange = ({target}) => {
    setInfo({...info , [target.name] : target.value})

  } 


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/admin/login", info)
      // localStorage.setItem("token", response.data.token)
      console.log(response.data)
      if (response.data.message === "ok"){ 
        navigat('/admin/')
      } else {

          setError({...error , err : true , message : response.data.error})
        } 
    } catch (errr) {
        console.log(error);
        
    }
  }
  
  
  
    return (
    
    <div>
        <div className="form-box">
          <form
            className="form"
            method="POST"
            onSubmit={(e) => handleSubmit(e)}
          >
            <span className="title">ADMIN LOG IN</span>
            {/* <span className="subtitle">Create a free account with your email.</span>  */}
            {/* {% if error %} */}
            {error.err == true && (
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
                type="password"
                className="input"
                placeholder="Password"
                name="password"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <button type="submit">Connexion</button>
            </form>
            <div className="form-section">
              <p>Don't have an account? <Link to="/admin/signup">Sign up</Link></p>

            </div>
            </div>
    </div>
  )
}
