import React from "react";

function PorteValues(props) {
  return (
    <div className="valueContainer">
      <span>{props.title}</span>
      <span>{props.value}</span>
    </div>
  );
}

export default PorteValues;
