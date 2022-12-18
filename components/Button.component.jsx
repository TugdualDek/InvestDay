import React from "react";
import ButtonStyles from "../styles/button.module.css";
function Button({ title, onClick }) {
  return (
    <button className={ButtonStyles.buttonContainer} onClick={onClick}>
      {title}
    </button>
  );
}

export default Button;
