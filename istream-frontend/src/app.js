import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "bootstrap/dist/css/bootstrap.css";
import "src/css/style.css";

import Home from "src/views/Home/Home";
import Login from "src/views/Login/Login";
import Register from "src/views/Register/Register";

ReactDOM.render(
   <div>
      <Router>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
         </Routes>
         <ToastContainer position="bottom-left" autoClose={5000} />
      </Router>
   </div>,
   document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
