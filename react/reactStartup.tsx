import React from "react";
import { render } from "react-dom";

render(
  <div>
    {/* <h1>Hi there {process.env.VITE_HELLO}</h1> */}
    {/* <h1>Hi there {process.env.VITE_HELLO2}</h1> */}
    {/* <h1>Hi there {import.meta.env.VITE_HELLO}</h1>
    <h1>Hi there {import.meta.env.VITE_HELLO2}</h1> */}
    <h1>Hi there XY = {import.meta.env.VITE_X}</h1>
    {/* <h1>Hi there {import.meta.env.NODE_ENV}</h1>
    <h1>Hi there {import.meta.env.NODE_ENV}</h1> */}
    {/* <h1>Hi there {process.env.NODE_ENV}</h1> */}
  </div>,
  document.getElementById("home")
);
