import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "bootstrap/dist/css/bootstrap.css";
import "src/css/style.css";

import Preview from "src/views/Preview/Preview";
import Login from "src/views/Login/Login";
import Register from "src/views/Register/Register";
import Home from "src/views/Home/Home";
import Setting from "src/views/Setting/Setting";
import Experiment from "src/views/Experiment/Experiment";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
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
   </div>
);
