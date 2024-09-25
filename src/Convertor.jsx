import React, { useState } from "react";
import Excel from "./Excel";
import Calculator from "./Calculator";

export default function Convertor() {
  const [countMount, setCountMount] = useState(0);
  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <Excel setCountMount={setCountMount}   />
        </div>
        <div className="col-6">
          <Calculator
            setCountMount={setCountMount}
            countMount={countMount}
          />
        </div>
      </div>
    </div>
  );
}
