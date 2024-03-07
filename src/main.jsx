import React from "react";
import ReactDOM from "react-dom/client";
import { appWindow } from "@tauri-apps/api/window";
import App from "./App";
import close from "./assets/close.png";
import min from "./assets/minimize-sign.png";
import max from "./assets/maximize.png";
import "./styles.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div data-tauri-drag-region className="titlebar">
        <div
          className="titlebar-button max"
          onClick={() => appWindow.toggleMaximize()}
        >
          <img src={max} alt="maximize" />
        </div>
        <div
          className="titlebar-button min"
          onClick={() => appWindow.minimize()}
        >
          <img src={min} alt="minimize" onClick={() => appWindow.minimize()} />
        </div>
        <div
          className="titlebar-button close"
          onClick={() => appWindow.close()}
        >
          <img src={close} alt="close" />
        </div>
      </div>
        <App/>
  </React.StrictMode>,
);
