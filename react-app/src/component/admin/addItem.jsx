import axios from "axios";
import React, { useState } from "react";

export default function AddItem() {
  const [itemInfo, setItemInfo] = useState({
    nom: "",
    categorie: "",
    prix: "",
    description: "",
    image: "",
  });
  const [respone, setResponse] = useState({ error: "" });

  const fileValidate = (file) => {
    if (
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/jpeg"
    ) {
      setResponse({ error: "" });
      return true;
    } else {
      setResponse({ error: "file type not allowed. Only jpg , png , jpeg" });
      return false;
    }
  };
  const handleChange = (target) => {
    // console.log(target.attribut);
    if (target.name === "image") {
      // console.log(target.files[0].type);
      let imageArray = [];
      // for (let i = 0 ; i < target.files.length ; i++) {
      fileValidate(target.files[0]);
      let file = target.files[0];
      imageArray.push(file);

      // }
      setItemInfo({ ...itemInfo, image: imageArray });
    } else {
      setItemInfo({ ...itemInfo, [target.name]: target.value });
      console.log(itemInfo);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (
      itemInfo.nom !== "" && 
      itemInfo.prix !== "" &&
      itemInfo.categorie !== ""

    ) {
      data.append("files[]", itemInfo.image[0]);
      data.append("nom", itemInfo.nom);
      data.append("categorie", itemInfo.categorie);
      data.append("description", itemInfo.description);
      data.append("prix", itemInfo.prix);
      try {
        const res = await axios.post("/admin/add_item", data);
        console.log(res.data);
        if (res.data.message) {
          alert("Message : " + res.data.message)
          window.location.reload()
        }
      } catch (error ) {
        console.log(error.response.data.error);
        setResponse({"error" : error.response.data.error})
      }
    } else {
      setResponse({ error: "Please fill all the fields" });
      
    }
    // for (let i = 0; i < itemInfo.image.length; i++) {
    // }
    
    // d  

    
  };
  return (
    <div>
      <div className="container">
        <div className="form-box">
          <form
            className="form"
            method="POST"
            onSubmit={(e) => handleSubmit(e)}
            encType="multipart/form-data"
          >
            <span className="title">ADD ITEM</span>
            <span className="subtitle text-danger">
              {respone.error !== "" && respone.error}
            </span>
            <div className="form-container">
              <input
                type="text"
                name="nom"
                id=""
                className="input"
                placeholder="Nom"
                onChange={(e) => handleChange(e.target)}
              />
              
              {respone.error !== "" && itemInfo.nom === "" && <span className="text-danger">require filed</span>}
              <select
                name="categorie"
                className="form-control form-select"
                id=""
                // defaultValue={""}
                onChange={(e) => handleChange(e.target)}
              >
                <option selected disabled>
                  Select City*
                </option>
                <option value="boisson" key="1">
                  Boisson
                </option>
                <option value="dessert" key="2">
                  Dessert
                </option>
                <option value="fast food" key="3">
                  fast food
                </option>
                <option value="plat principal" key="4">
                  Plat Procipal
                </option>
              </select>
              {respone.error && itemInfo.categorie === "" && <span className="text-danger">require filed</span>}
              <input
                type="text"
                className="input"
                name="prix"
                placeholder="Prix"
                onChange={(e) => handleChange(e.target)}
                
              />
              {respone.error && itemInfo.nom === "" && <span className="text-danger ">require filed</span>}
              <textarea
                name="description"
                id=""
                className="input"
                placeholder="Description"
                onChange={(e) => handleChange(e.target)}
              ></textarea>
              <input
                type="file"
                name="image"
                className="input form-control"
                id=""
                placeholder="Image"
                onChange={(e) => handleChange(e.target)}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Add item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
