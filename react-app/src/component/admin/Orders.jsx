import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [changer, setChanger] = useState();
  const [search, setSearch] = useState({
    name: "",
    obj: { exits: false, similiers: [] },
  });
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

  function pupUp(val) {
    let len = val.toString().length;
    let phonesNumbers = orders.map((ord) => ord.user.telephone);
    let similiers = phonesNumbers.filter((number) => {
      if (number.slice(0, len) === val) {
        return number;
      }
    });
    console.log(similiers);
    let uniques = [...new Set(similiers)];
    console.log(uniques);
    if (uniques.length > 0) {
      setSearch({
        ...search,
        obj: { exits: true, similiers: uniques },
        name: val,
      });
    }
  }

  const handleChange = ({ target }) => {
    setSearch({ ...search, name: target.value });
    pupUp(target.value);
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
            value={search.name}
            className="form-control"
            onChange={(e) => handleChange(e)}
          />
          {search.obj.exits && (
        <div className="pup-up">
          <ul className="list-group">
            {search.obj.similiers.map((num, i) => (
              <div className="list-group-item" value={num} key={i}
                onClick={(e)=> setSearch({...search , obj : { exits : false } , name : num})}>
                <b className="text-primary">{search.name}</b>
                {num.slice(search.name.length)}
              </div>
            ))}
          </ul>
        </div>
      )}
          <button
            className="btn btn-primary"
            onClick={() => handleSearch(search.name)}
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
            <th style={{ textAlign: "center" }}>
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
              <td
                onClick={() => handleClick(o)}
              >{`${o.user.nom} ${o.user.prenom}`}</td>
              <td onClick={() => handleClick(o)}>{o.user.telephone}</td>
              <td onClick={() => handleClick(o)}>{`${o.order_date.slice(
                5,
                16
              )} ${o.order_date.slice(17, 25)}`}</td>
              <td onClick={() => handleClick(o)}>{o.prix}</td>
              <td style={{ textAlign: "center" }}>
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
