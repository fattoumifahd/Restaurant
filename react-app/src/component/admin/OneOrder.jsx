import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OneOrder() {
  const [info, setInfo] = useState();
  const [changer , setChanger] = useState()
  let { state } = useLocation();
  let navigate = useNavigate()
  const getInfo = async () => {
    try {
      const respone = await axios.get(`/order_info/${state.order.order_id}`);
      if (respone.data.message) {
        navigate('/admin/orders')
      } else {
        console.log(respone.data);
        setInfo(respone.data.order_info);

      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInfo();
  }, [changer]);


  const handleDelete = async (item) => {
    console.log(item)
  try {
    const res = await axios.post(`/order_info/${state.order.order_id}/${item.item_id}/delete`)
    console.log(res.data)
    setChanger(res.data)
  }catch (error) {
    console.log(error)
  }

  }
  return (
    <div>
      <h2 style={{ margin: "10px auto", width: "15%" }}>Order Details</h2>
      <table className="table mt-5">
        <thead>
          <tr>
            {/* <th>Order ID</th> */}
            <th><h6>Libelle</h6></th>
            <th><h6>Prix</h6></th>
            <th><h6>Quantite</h6></th>
            <th style={{ width: "15rem", paddingLeft: "81px" }}><h6>Action</h6> </th>
          </tr>
        </thead>
        <tbody>
          {info &&
            info.items.map((item, i) => {
              return (
                <tr key={i}>
                  {console.log(item.item_id)}
                  <td>{item.item_nom}</td>
                  <td>{item.item_prix}</td>
                  <td>{item.quantity}</td>
                  <td className="action" style={{ width: "15rem" }}>
                    <button className="btn btn-danger" onClick={()=> handleDelete(item)}>Supprimer</button>
                    {/* <button className="btn btn-primary">Update</button> */}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
