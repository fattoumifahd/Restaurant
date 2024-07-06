import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function NavBar() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  // const [categorie , setCategorie] = useState(false)
  // let changeCategorie = () => {
  //   setCategorie(!categorie)
  // }
  //
  useEffect(() => {
    get_login();
  }, []);
  const logout = async () => {
    try {
      const res = await axios.get("/api/logout");
      console.log(res.data.user);
      setUser(null);
      localStorage.removeItem('user');
      navigate('/login')
      
    } catch (error) {
      console.log(error);
    }
    // navigat = useNavigate()
  };
  const get_login = async () => {
    try {
      let res = await axios.get("/api/login");
      setLogin(res.data.user);
      console.log(res.data.user);
      if (res.data.user != null) {
        setUser(res.data.user);
        localStorage.user = JSON.stringify(res.data.user)
      } else {
        setUser(null);
      }

    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="menu-bar">
        <h1 className="logo">
          Ocean's<span>Catch</span>
        </h1>
        <ul>
          <li>
            <Link to={"/"}>Home </Link>
          </li>
          <li>
            <Link to={""}>
              Menu <i className="fas fa-caret-down"></i>
            </Link>
            <div className="dropdown-menu">
              <ul>
                <li>
                  <Link to={"/menuItems"} state={{ cate: "fast food" }}>
                    Fast Food{" "}
                  </Link>
                </li>
                <li>
                  <Link to={"/menuItems"} state={{ cate: "plat principal" }}>
                    Plats Principal
                  </Link>
                </li>
                <li>
                  <Link to={"/menuItems"} state={{ cate: "dessert" }}>
                    Desserts
                  </Link>
                </li>
                <li>
                  <Link to={"/menuItems"} state={{ cate: "boisson" }}>
                    Boissons
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Link to={'/compus'}>Nos Compus</Link>
          </li>
          {
            user != null && 
          <li>
            <Link to={"/reserver"}>Make Reservation</Link>
          </li>
          }
          {
            user != null  && 
            <li><Link to={'/userReservation'} state={{"user" : user}} >My Reservation</Link></li>
          }
          
        </ul>

        { user !== null ? (
          <div className="user">
            <div>
              <span>{user.prenom + " "}</span>
              <span>{user.nom}</span>
            </div>

            <button onClick={() => logout()} className="btn btn-danger">
              Log Out
            </button>
          </div>
        ) : (
          <Link to={"/login"} className="btn btn-secondary ">
            <span>Log in</span>
          </Link>
        )}
      </div>
    </>
  );
}
