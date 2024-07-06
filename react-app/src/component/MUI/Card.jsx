import React from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link, useNavigate } from "react-router-dom";
import Reserver from "../Reserver";


export default function CardCompus({ compus }) {
  const navigate = useNavigate()
  
  // const handleCLick = (comp) => {
  //   navigate('/reserver' , {state : {comp}})
  // } 

  return (
    
    <div className="card-category-1">
            
    <div className="basic-card basic-card-aqua">
        <div className="card-content">
            <span className="card-title">{compus.ville}</span>
            <p className="card-text d-flex justify-content-around">
                <span>{<LocationOnIcon/>}</span>
                <span>{compus.place}</span>
            </p>
            <p className="card-text d-flex align-items-center justify-content-around w-75">
              <span><LocalPhoneIcon/></span>
              <span className="card-text">
                {compus.telephone}
              </span>
            </p>
        </div>

        {/* <div className="card-link">
            <Link to={"/reserver"}>Reserver</Link>
        </div> */}
    </div>
    </div>
  );
}
