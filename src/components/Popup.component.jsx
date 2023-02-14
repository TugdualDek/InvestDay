import React, { useState } from "react";
import PopupStyles from "../styles/Popup.module.css";
import { Request } from "../types/request.type";
import { useFetch } from "../context/FetchContext.js";
import { useWallet } from "../context/WalletContext";

function Popup({ title, subtitle, sell, symbol }) {
  const { wallets, selectedId } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);
  const fetch = useFetch();

  // change the value of the input field when the user clicks on the increase or decrease button and the value is greater than 0

  const handleCount = (e) => {
    let newNum;
    if (e.target.classList.contains(PopupStyles.increase)) {
      newNum = Number(count) + 1;
      setCount(String(newNum));
    } else if (e.target.classList.contains(PopupStyles.decrease)) {
      // if the value is greater than 0, decrease the value
      if (count > 0 && Number(count) - 1 > 0) {
        newNum = Number(count) - 1;
        setCount(newNum);
      } else if (count === 0 || count < 0) {
        // if the value is 0, do nothing
        setCount(0);
      }
    }
  };

  //on any change in the input field, update the value of the count state
  const handleChange = (e) => {
    // if the value is not a number, do nothing
    if (isNaN(e.target.value)) {
      return;
    }
    setCount(e.target.value);
  };

  let url = "http://localhost:3000/api/transactions/";

  //create the function that will buy a stock using the api
  const buyStock = () => {
    console.log("buying stock");
    console.log("wallet id", wallets[0].id);
    console.log("symbol", symbol);
    console.log("amount", count);
    //fetch the api to buy a stock
    fetch.post(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        symbol: title,
        amount: count,
        walletId: selectedId,
      }),
    }).then((res) => {
      console.log(res);
    });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Acheter</button>
      {isOpen && (
        <div className={PopupStyles.modalBackdrop}>
          <div className={PopupStyles.modal}>
            <div className={PopupStyles.modalContent}>
              <div className={PopupStyles.modalTitle}>
                <h1>{title}</h1>
                <span className={PopupStyles.modalSubtitle}>{subtitle}</span>
              </div>

              <div className={PopupStyles.inputNumberWrapper}>
                <button className={PopupStyles.decrease} onClick={handleCount}>
                  -
                </button>
                <input type="text" value={count} onChange={handleChange} />
                <button className={PopupStyles.increase} onClick={handleCount}>
                  +
                </button>
              </div>

              <button className={`${sell ? PopupStyles.buttonBuy : PopupStyles.hidden}`}>Vendre</button>
              <button className={PopupStyles.buttonBuy} onClick={buyStock}>Acheter</button>

            </div>

            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Popup;
