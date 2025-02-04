import React from "react";
import ReactDOM from "react-dom";
//
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
// STYLE
import "./styles/index.scss";
import "./index.css";
import "./fonts/line-awesome-1.3.0/css/line-awesome.css";

// ** Redux Imports
import { Provider } from 'react-redux'
import { store } from './redux/storeConfig/store'

//
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
