import "react-app-polyfill/ie11"; // For IE 11 support
import "react-app-polyfill/stable";
import "./polyfill";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { icons } from "./assets/icons";
import { Provider } from "react-redux";
import store from "../src/modules/store";
import * as Sentry from "@sentry/browser";

React.icons = icons;

Sentry.init({
  dsn: "https://96e7a7c96c534e3ba85c2e0a36db7b13@o288721.ingest.sentry.io/5501043",
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
