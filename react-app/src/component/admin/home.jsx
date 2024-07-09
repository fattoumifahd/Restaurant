import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularIndeterminate from "../CircularIndeterminate";

export default function AdminHome() {
  const [admin , setAdmin] = useState({})
  useEffect(()=> {
    get_login();
  },[])
    const navigate = useNavigate()

    const handleLogout = async () => {
      try {
        const res = await axios.get('/admin/logout')
        console.log(res.data);
        navigate('/admin/login')
      } catch (error) {
        console.log(error)
      }
    }

    const get_login = async () => {
      try {
        const res = await axios.get("/admin/login")
        console.log(res.data.admin)
        if (res.data.admin == null) {
          navigate('/admin/login')
        } else {
          setAdmin(res.data.admin)
          localStorage.setItem('admin' , res.data.admin)
        }
      } catch (error) {
        console.log(error);
      }
    }
  return (
    <>
    {
      admin == {}  ? <CircularIndeterminate  /> :
      <>
      <div className="header">
      <h1>Admin Dashboard</h1>
      
      <button className="btn btn-danger" onClick={()=>handleLogout()}>Log Out</button>
      
    </div>
    <div className="admin">
      <button className="btn btn-success" onClick={()=> navigate("/admin/orders")}>Commands</button>
      <button className="btn btn-success" onClick={()=> navigate("/admin/reservations")}>Reservations</button>
      <button className="btn btn-success" onClick={()=> navigate("/admin/add_item")}>Ajouter Produit</button>
    </div>
    </>
    }
    </>
  );
}
