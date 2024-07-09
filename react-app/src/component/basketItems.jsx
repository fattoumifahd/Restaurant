import React, { useEffect, useState } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./navBar";
export default function BasketItems() {
  const location = useLocation();
  const { basket } = location.state;
  const [quantite, setQuantite] = useState({});
  const [total, setTotal] = useState(0);
  const navigate = useNavigate()
  const [basket1 , setBasket1] = useState(basket)



  useEffect(() => {
    insializeQuentite()

    console.log(basket)
  }, []);
  
  
  
  const insializeQuentite = () => {
    basket.map((item) =>
      setQuantite((prev) => ({ ...prev, [item.item_id]: 1 }))
    );

    console.log(quantite);
  };

  const calcTotal = () => {
    let toto = 0;
    basket1.map(
      (item) => (toto += Number(quantite[item.item_id]) * Number(item.prix))
    );
    setTotal(toto);
  };

  const increment = (id) => {
    setTotal(0);
    setQuantite({ ...quantite, [id]: quantite[id] + 1 });
  };

  const dicrement = (id) => {
    if (quantite[id] > 1) {
      setQuantite({ ...quantite, [id]: quantite[id] - 1 });
      setTotal(0);
    } else {
      setQuantite({ ...quantite, [id]: 1 });
    }
  };

  // const commander = async () => {
  //   confirmAlert({
  //     title: "Confirmation de commande",
  //     message : "Did you Have a Resevation ?",
  //     buttons : [
  //       {
  //         label: "Yes",
  //         onClick: () => {
  //           prompt("Enter your reservation code ")
  //         }
  //       },
  //       {
  //         label: "No",
  //         onClick: () => {

  //         }
  //       }
  //     ],

  //   })
  // }


  const handleRemove = (item) => {
    setBasket1(basket1.filter((e ) => e !== item))
  }

  const commander = async () => {
    let user = {};
    user = JSON.parse(localStorage.getItem("user"));
    // console.log();
    if (user) {
      const user_id = user.user_id;
      try {
        const res = await axios.post("/add_order", {
          quantite,
          total,
          user_id,
          "basket" : basket1,
        });
        console.log(res.data);
        if (res.data.message === "ok") {
          alert("la commande est passe en success !");
          navigate("/");
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      alert("you need to login");
      navigate("/login");
    }
  };



  return (
    <>
      <NavBar />
      <div className="container">
        <div className="table-container">
          <h1>BasketItems</h1>
          <table className="table text-center">
            <thead>
              <tr className="tr-basket">
                <th>Produit</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {basket1.map((item, i) => (
                <tr key={i} className="">
                  <td>{item.nom}</td>
                  <td>{item.prix}</td>
                  <td className="qte">
                    <button
                      onClick={() => dicrement(item.item_id)}
                      className="btn btn-danger"
                    >
                      -
                    </button>
                    <span>{quantite[item.item_id]}</span>
                    <button
                      onClick={() => increment(item.item_id)}
                      className="btn btn-primary"
                    >
                      +
                    </button>
                  </td>
                  <td >
                    <i style={{ cursor: "pointer" }} class="bi bi-trash3-fill" onClick={()=>handleRemove(item)}></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={() => calcTotal()}>
            Termine la command{" "}
          </button>

          {total != 0 && (
            <div className="total d-flex align-items-center justify-content-sm-between w-25 mt-3">
              <h1>{total.toFixed(2)} DH</h1>
              <button className="btn btn-success" onClick={() => commander()}>
                Commander
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
