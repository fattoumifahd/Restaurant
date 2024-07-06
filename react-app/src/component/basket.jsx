import React from "react";
import { useNavigate } from "react-router-dom";

export default function Basket({ basket, number }) {
  const navigate = useNavigate();
  const handelClick = () => {
    navigate('/basketItems' , {state: {basket}})
  }
  return (
    <div className="basket" onClick={()=>handelClick()}>
      <div className="img">
        <div className="number">{number}</div>
        <img src="static/images/wicker-basket-green.png" alt="basketIMG" />
      </div>
    </div>
  );
}
