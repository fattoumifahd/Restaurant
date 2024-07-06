import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularIndeterminate from "./CircularIndeterminate";
import NavBar from "./navBar";
import { useNavigate } from "react-router-dom";

export default function Reserver() {
  const [compus, setCompus] = useState(null);
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [reservation, setReservation] = useState({
    ville: "",
    compus_id: "",
    invite: 0,
  });
  useEffect(() => {
    getCompus();
  }, []);
  const getCompus = async () => {
    try {
      const res = await axios.get("/compus");
      setCompus(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = ({ target }) => {
    setReservation({ ...reservation, [target.name]: target.value });
  };

  const checkDisabled = () => {
    if (reservation.ville != "" && reservation.place != "") {
      return true;
    } else return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post(
        `/add_reservation/${user.user_id}`,
        reservation
      );
      console.log(res.data);
      if (res.data.message == "ok") {
        alert("La reservation est passer on success !")
        navigate('/')
      }
    } catch (error) {
      console.log(error);
    }
  };
  // const location = useLocation();
  // const { comp } = location.state;
  // console.log(comp)
  return compus == null ? (
    <CircularIndeterminate />
  ) : (
    <>
      <NavBar />
      {console.log(user.user_id)}
      <div className="container">
        <div className="form-box">
          <form
            className="form"
            method="POST"
            onSubmit={(e) => handleSubmit(e)}
          >
            <span className="title">Reservation</span>
            <span className="subtitle"></span>
            <div className="form-container">
              <select
                name="ville"
                className="form-control form-select"
                id=""
                onChange={(e) => handleChange(e)}
              >
                <option selected disabled defaultValue={""}>
                  Select City*
                </option>
                <option value="RABAT" key="1">
                  Rabat
                </option>
                <option value="CASABLANCA" key="2">
                  Casablanca
                </option>
                <option value="MARRAKECH" key="3">
                  Marakech
                </option>
              </select>
              {reservation.ville != "" && (
                <select
                  name="compus_id"
                  onChange={(e) => handleChange(e)}
                  className="form-select"
                  id=""
                >
                  <option defaultValue="" selected="selected" disabled key="10">
                    Select Place *
                  </option>
                  {compus.map((e, i) => {
                    if (e.ville == reservation.ville) {
                      return (
                        <option key={i} value={e.compus_id}>
                          {e.place}
                        </option>
                      );
                    }
                  })}
                </select>
              )}
              {reservation.place != "" && (
                <input
                  type="number"
                  name="invite"
                  id=""
                  placeholder="Visitors"
                  className="input"
                  min={1}
                  max={10}
                  onChange={(e) => handleChange(e)}
                />
              )}
            </div>
            {checkDisabled() ? (
              <input
                type="submit"
                value="Reserver"
                className="btn btn-primary"
              />
            ) : (
              <input
                type="submit"
                value="Reserver"
                className="btn btn-primary"
                disabled
              />
            )}
          </form>
        </div>
      </div>
    </>
  );
}
