import React, { useState } from "react";
import PopupStyles from "../styles/Popup.module.css";
import { Request } from "../types/request.type";
import { useFetch } from "../context/FetchContext.js";
import Button from "../components/Button.component";
import { useWallet } from "../context/WalletContext";
import { toast } from "react-toastify";

function Popup({
  title,
  subtitle,
  sell,
  symbol,
  maxCount = 10000,
  detail,
  openDefault = false,
}) {
  const { wallets, selectedId } = useWallet();
  const [isOpen, setIsOpen] = useState(openDefault);
  const [count, setCount] = useState(0);
  const fetch = useFetch();

  // change the value of the input field when the user clicks on the increase or decrease button and the value is greater than 0

  function handleOpen() {
    setIsOpen(true);
    let start = new Date("2023-02-20T14:30:00.000Z");
    let now = new Date();
    if (now < start) {
      toast.error(
        "Le concours n'est pas encore ouvert ! Rendez-vous à 15h30 !"
      );
    }
  }
  const handleCount = (e) => {
    let newNum;
    //check if new value is greater thant maxCount
    if (e.target.classList.contains(PopupStyles.increase)) {
      if (count < maxCount) {
        // check if count +1 is greater than maxCount
        if (Number(count) + 0.1 > maxCount) {
          setCount(maxCount);
          return;
        } else {
          newNum = Number(count) + 0.1;
          setCount(newNum.toFixed(1));
        }
      } else {
        setCount(maxCount);
      }
    } else if (e.target.classList.contains(PopupStyles.decrease)) {
      // if the value is greater than 0, decrease the value
      if (count > 0 && Number(count) - 0.1 > 0) {
        newNum = Number(count) - 0.1;
        setCount(newNum.toFixed(1));
      } else if (count === 0 || count < 0) {
        // if the value is 0, do nothing
        setCount(0);
      }
    }
  };

  //on any change in the input field, update the value of the count state
  const handleChange = (e) => {
    let num = Number(e.target.value);
    // if the value is not a number, do nothing
    if (isNaN(e.target.value)) {
      return;
    }
    // if the value is greater than maxCount, set the value to maxCount
    if (Number(e.target.value) > maxCount) {
      setCount(maxCount);
      return;
    }
    setCount(num);
  };

  //create the function that will buy a stock using the api
  const executeOrder = () => {
    let quantity = count;
    if (quantity <= 0) return;
    if (quantity > maxCount) quantity = maxCount;

    quantity = Number(quantity).toFixed(1);
    if (sell) {
      console.log(
        "SELLING",
        quantity,
        "of",
        symbol,
        "with wallet",
        wallets[selectedId].id
      );
      fetch.post("/api/transactions/", {
        walletId: wallets[selectedId].id,
        symbol: symbol,
        amount: quantity,
        selling: "true",
      });
    } else {
      console.log(
        "BUYING",
        quantity,
        "of",
        symbol,
        "with wallet",
        wallets[selectedId].id
      );
      fetch.post("/api/transactions/", {
        walletId: wallets[selectedId].id,
        symbol: symbol,
        amount: quantity,
        selling: "false",
      });
    }
    toast.success("Votre ordre à été créé !");

    //close the popup
    setIsOpen(false);
  };

  return (
    <>
      <Button
        title={sell ? "Vendre" : "acheter"}
        onClick={() => handleOpen()}
      />
      {isOpen && (
        <div className={PopupStyles.modalBackdrop}>
          <div className={PopupStyles.modal}>
            <div className={PopupStyles.modalContent}>
              <div className={PopupStyles.modalTitle}>
                <h1 className={PopupStyles.modalTitle}>{title}</h1>
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

              <button
                className={PopupStyles.buttonBuy}
                onClick={() => executeOrder()}
              >
                {sell ? "Vendre" : "Acheter"}
              </button>
            </div>

            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Popup;
