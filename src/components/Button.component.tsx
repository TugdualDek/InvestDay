import React, { useEffect } from "react";
import ButtonStyles from "../styles/button.module.css";
import { useState } from "react";
function Button({
  title,
  onClick,
  selected,
  disabled,
}: {
  title: string;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
}) {
  const [isSelected, setSelected] = useState(
    typeof selected === "undefined" ? true : selected
  );

  useEffect(() => {
    if (typeof selected !== "undefined") setSelected(selected);
  }, [selected]);
  return (
    // if disabled is true, add disabled element to button
    <button
      className={`${ButtonStyles.buttonContainer} ${
        !isSelected ? ButtonStyles.buttonContainerNotSelected : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
}

export default Button;
