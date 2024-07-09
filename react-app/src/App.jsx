import React from "react";
import { Route  , Routes , BrowserRouter} from 'react-router-dom'
// import axios from "axios";
import NavBar from "./component/navBar";
import Home from "./component/Home";
import Signup from "./component/signup";
import MenuItems from "./component/MenuItems";
import Login from "./component/login";
import BasketItems from "./component/basketItems";
import MyReservation from "./component/MyReservation";
import Reserver from "./component/Reserver";
import Compus from "./component/Compus";
import ForgetPass from "./component/ForgetPass";
import AdminHome from "./component/admin/home";
import Reservations from "./component/admin/Reservations";
import Orders from "./component/admin/Orders";
import AdminLogin from "./component/admin/Login";
import AdminSingup from "./component/admin/Singup";
import OneOrder from "./component/admin/OneOrder";
import AddItem from "./component/admin/addItem";
import MailVerification from "./component/MailVerification";





function App() {




  
 
  return (
    <BrowserRouter >
    

      {/* <NavBar /> */}
    {/* <div className="container"> */}
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/singup" element={<Signup />} />
          <Route path="/mail_verify" element={<MailVerification />} />
          <Route path="/menuItems"   element={<MenuItems />}  />
          <Route path="/login" element={<Login />} />
          <Route path="/basketItems" element={<BasketItems />} />
          <Route path="/reserver" element={<Reserver /> } />
          <Route path="/userReservation" element={<MyReservation />} />
          <Route path="/compus" element={<Compus />} />
          <Route path="/forgetPassword" element={<ForgetPass />} />
          {/* ADMINS ROUTES */}
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/reservations" element={<Reservations />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSingup />} />
          <Route path="/order/:id" element={<OneOrder />} />
          <Route path="/admin/add_item" element={<AddItem />} />
      </Routes>
  {/* </div> */}
  </BrowserRouter>
  )

}

export default App;
