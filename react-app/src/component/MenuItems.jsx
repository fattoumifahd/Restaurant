import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CircularIndeterminate from "./CircularIndeterminate";
import Basket from "./basket";
import NavBar from "./navBar";

export default function MenuItems() {
  const location = useLocation();
  const [basket, setBasket] = useState([]);
  const [items, setItems] = useState(null);
  const { cate } = location.state;
  //   const [categorie , setCategorie] = useState(cate)
  useEffect(() => {
    fetch_data();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cate]);
  const fetch_data = async () => {
    try {
      setItems([{}]);
      let response = await axios("/menuItems/" + cate);
      setItems(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handelClick = (item) => {
    setBasket([...basket, item]);
    console.log(basket);
  };
  const removeItemBasket = (id) => {
    setBasket(basket.filter((item) => item.id !== id));
  };

  return items === null ? <CircularIndeterminate /> : (
    <>
    <NavBar />
    <div className="container">
      <div className="wrapper">
        {/* {console.log(basket)} */}
        {items == null ? (
          <CircularIndeterminate />
        ) : (
          items.map((item, i) => {
            return (
              <div key={i} className="card" style={{ width: "18rem" }}>
                <img
                  
                  src={"static/images/" + item.categorie + "/" + item.image}
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body" >
                  <h5 className="card-title">{item.nom}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text">{item.prix} DH</p>
                  <div>
                    <button
                      onClick={() => handelClick(item)}
                      className="btn btn-primary"
                    >
                      ajouter sur panier
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {basket.length > 0 && <Basket basket={ basket}  number= {basket.length } />}
      </div>
    </>
  );
}
