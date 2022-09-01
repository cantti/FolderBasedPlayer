import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import PlayerProvider from "./PlayerContext";

ReactDOM.render(
  <PlayerProvider>
    <App />
  </PlayerProvider>,
  document.getElementById("root")
);
