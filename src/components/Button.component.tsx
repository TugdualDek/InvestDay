import React, { useEffect } from "react";
import ButtonStyles from "../styles/button.module.css";
import { useState } from "react";
function Button({
  title,
  onClick,
  selected,
}: {
  title: string;
  onClick: () => void;
  selected?: boolean;
}) {
  const [isSelected, setSelected] = useState(
    typeof selected === "undefined" ? true : selected
  );

  useEffect(() => {
    if (typeof selected !== "undefined") setSelected(selected);
  }, [selected]);
  return (
    <button
      className={`${ButtonStyles.buttonContainer} ${
        !isSelected ? ButtonStyles.buttonContainerNotSelected : ""
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default Button;
