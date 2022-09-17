import React, { useState, useEffect } from "react";
import "../style/rechercher.css";

function Rechercher() {
  const [dataName, setData] = useState();
  const [name, setName] = useState("");
  const [timer, setTimer] = useState(null);

  function fetchData(name) {
    return fetch(
      "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" +
        name +
        "&apikey=4ERX661ZPPZKBICZ"
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Unable to contact the server");
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const updateName = (event) => {
    const newName = event.target.value;
    setName(newName);
    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      fetchData(newName);
    }, 500);

    setTimer(newTimer);
  };

  return (
    <div className="searchContainer">
      <h1>Rechercher</h1>
      <div className="form">
        <div className="formContainer">
          <ion-icon className="searchIcon" name="search-outline"></ion-icon>
          <input
            type="text"
            placeholder="Search.."
            autoComplete="off"
            name="search"
            className="searchForm"
            onChange={updateName}
          />
        </div>
      </div>
    </div>
  );
}

export default Rechercher;
