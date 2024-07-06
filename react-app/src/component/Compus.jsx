import axios from "axios";
import React, { useEffect, useState } from "react";
import CircularIndeterminate from "./CircularIndeterminate.jsx";
import CardCompus from "./MUI/Card.jsx";
import NavBar from "./navBar.jsx";

export default function Compus() {
  const [nosCompus, setCompus] = useState([]);
  useEffect(() => {
    getCompus()
  }, []);

  const getCompus = async () => {
    try {
      const res = await axios.get("/compus");
      setCompus(res.data);
      console.log(res.data)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <NavBar />
    {
        nosCompus == null ? <CircularIndeterminate /> : 
    <div className="wrapper">
        {
        nosCompus.map((e , i) => { return ( <div className="card-container" key={i}>
            <CardCompus compus={e} />
       </div>
        )})
             
        }
    </div>
    }
    </>
  );
}
