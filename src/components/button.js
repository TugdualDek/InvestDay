import React from "react";
import "../style/button.css";
function Button({ title, onClick }) {
  return (
    <button className={"buttonContainer"} onClick={onClick}>
      {title}
    </button>
  );
}

export default Button;
