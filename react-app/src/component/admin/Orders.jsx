import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [changer, setChanger] = useState();
  const [search, setSearch] = useState();
  const navigate = useNavigate();

  const get_orders = async () => {
    try {
      const res = await axios.get("/admin/orders");
      console.log(res.data.orders);
      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    get_orders();
  }, [changer]);

  const handlePayment = async (id) => {
    try {
      const res = await axios.post(`/order/payment/${id}`);
      setChanger(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (order) => {
    navigate(`/order/${order.order_id}`, { state: { order: order } });
  };

  const handleChange = ({ target }) => {
    setSearch(target.value);
  };

  const handleSearch = (search) => {
    let result = orders.filter((o) => {
      return o.user.telephone === search;
    });
    setOrders(result);
  };

  return (
    <div>
      <h2 style={{ margin: "20px auto", width: "15%" }}>User Orders</h2>
      <div action="" className="form-search">
        <div>
          <input
            type="search"
            className="form-control"
            onChange={(e) => handleChange(e)}
          />
          <button
            className="btn btn-primary"
            onClick={() => handleSearch(search)}
          >
            Search
          </button>
        </div>
      </div>
      <table className="table mt-5 table-hover">
        <thead>
          <tr>
            <th>
              <h6>Nom et Prenom</h6>
            </th>
            <th>
              <h6>Telephone</h6>
            </th>
            <th>
              <h6>Date</h6>
            </th>
            <th>
              <h6>Prix</h6>
            </th>
            <th style={{ textAlign : "center"}}>
              <h6>Payer</h6>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr
              className="tr-order"
              key={i}
              style={
                i % 2 === 0
                  ? { backgroundColor: "rgb(117 117 117 / 4%)" }
                  : { backgroundColor: "whitesmoke" }
              }
              
            >
                <td onClick={() => handleClick(o)}>{`${o.user.nom} ${o.user.prenom}`}</td>
                <td onClick={() => handleClick(o)}>{o.user.telephone}</td>
                <td onClick={() => handleClick(o)}>{`${o.order_date.slice(5, 16)} ${o.order_date.slice(
                  17,
                  25
                )}`}</td>
                <td onClick={() => handleClick(o)}>{o.prix}</td>
              <td style={{textAlign: "center"}}>
                {!o.payer ? (
                  <button
                    onClick={() => handlePayment(o.order_id)}
                    className="btn btn-warning text-white"
                  >
                    
                    impayé
                  </button>
                ) : (
                  <button className="btn btn-success" disabled>
                    deja payé  
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
