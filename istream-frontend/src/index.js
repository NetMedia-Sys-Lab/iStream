import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "bootstrap/dist/css/bootstrap.css";
import "src/css/style.css";

import Preview from "src/views/Preview/Preview";
import Login from "src/views/Login/Login";
import Register from "src/views/Register/Register";
import Home from "src/views/Home/Home";
import Experiment from "src/views/Experiment/Experiment";
import Setting from "src/views/Setting/Setting";
import { useParams } from "react-router-dom";

ReactDOM.render(
   <div>
      <Router>
         <Routes>
            <Route path="/" element={<Preview />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/setting" element={<Setting />} />

            <Route path="/experiment/:experimentId" element={<Experiment experiment={() => useParams()} />} />
         </Routes>
         <ToastContainer position="bottom-left" autoClose={4000} />
      </Router>
   </div>,
   document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
