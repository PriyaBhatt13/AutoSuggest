import React from "react";
import { Provider } from "react-redux";

import store from "./store";
import Home from "./Home";
import "./index.css";

export default () =>
  <Provider store={store}>
    <Home />
  </Provider>;
