import axios from "axios";
import React, { useEffect, useState } from "react";
import CircularIndeterminate from "../CircularIndeterminate";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [stateChanger , setStateChanger] = useState(true);
  const [search , setSearch] = useState()
  useEffect(() => {
    getReservations();
  }, [stateChanger]);

  let getReservations = async () => {
    // setStateChanger(!stateChanger)
    try {
      let res = await axios.get("/admin/reservations");
      console.log(res.data.Reservations);
      setReservations(res.data.Reservations);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async (id) => {
    try {
      const res = await axios.post(`/reservations/payment/${id}`)
      console.log(res.data)
      setStateChanger(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (search) => {
    const res = reservations.filter((e) => e.user.telephone === search)
    setReservations(res)

  }

  const handleChange = ({target}) => {
    setSearch(target.value)
    
  } 
  return reservations == null ? <CircularIndeterminate /> :  (
    <>
      {reservations.length !== 0  ? 
        <>
          <h4 className="title" style={{margin : "2rem 41% 4rem 41%"}}>Users Reservations</h4>
          <div action="" className='form-search'>
        <div>
        <input type="search" className='form-control' onChange={(e)=>handleChange(e)} /> 
        <button className="btn btn-primary" onClick={()=>handleSearch(search)}>search</button>
        </div>
      </div>
          <table className="table reservations">
            <thead>
              <tr >
                <th><h6>Nom et prenom </h6></th>
                <th><h6>Telephone</h6></th>
                <th><h6>ville</h6></th>
                <th><h6>place</h6></th>
                {/* <th><h6>order</h6></th> */}
                <th><h6>date</h6> </th>
                <th style={{textAlign : "center"}}><h6>Payer</h6></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r, i) => (
                <tr key={i} border="1" style={i%2 === 0 ? {backgroundColor : "rgb(117 117 117 / 4%)"} : {backgroundColor : "whitesmoke"}} >
                  <td >{`${r.user.last_name} ${r.user.first_name}`}</td>
                  <td>{r.user.telephone}</td>
                  {/* {console.log(r.date.slice(0,2))} */}
                  <td>{r.compus_ville}</td>
                  <td>{r.compus_place}</td>
                  {/* <td>{r.order_id == null ? "pas d'order" : r.order_id}</td> */}
                  <td>{`${r.date.slice(5, 16)} ${r.date.slice(17, 26)}`}</td>
                  <td style={{textAlign : "center"}}>
                    {r.payer === true ? (
                      <button className="btn btn-success" disabled>
                        deja payer
                      </button>
                    ) : (
                      <button
                        className="btn btn-warning"
                        onClick={()=>handlePayment(r.id)}
                      >
                        impayé
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      : <p className="title">Aucune Reservation</p>}
    </>
  );
}
