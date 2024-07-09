import React from "react";
import NavBar from "./navBar";

export default function Home() {
  return (
    <>
    <NavBar />
    <div>
      <div className="slide1">
        <h1 className="text">GooD Foods TO PUT YOU IN A GOOD MODE.</h1>
        <span className="sup">Big Umani flavour, small footprint.</span>
      </div>
      <div className="slide2">
        <img src="static/images/home1.jpg" alt="" />
        <p>
          Welcome to Ocean's Catch, where culinary excellence meets warm
          hospitality in the heart of RABAT. Nestled amidst the vibrant streets
          of Agdal, our restaurant invites you to embark on a gastronomic
          journey like no other
        </p>
      </div>
    </div>
    </>
  );
}
