import React, { useState } from "react";
import PopupStyles from "../styles/Popup.module.css";
import { Request } from "../types/request.type";
import { useFetch } from "../context/FetchContext.js";
import Button from "../components/Button.component";
import { useWallet } from "../context/WalletContext";
import { toast } from "react-toastify";

function PopupSelling({ symbol, price, quantity, isOpen }) {
  if (!isOpen) return <></>;
  const { wallets, selectedId } = useWallet();
  const [count, setCount] = useState(0);
  const fetch = useFetch();
}
