import React, { Component } from "react";
import Header from "src/views/Common/Header";
// import VideoCard from "src/views/Experiment/VideoCard";
import NetworkCard from "src/views/Experiment/NetworkCard";
import ClientCard from "src/views/Experiment/ClientCard";
import "./Experiment.css";

export default class Experiment extends Component {
   render() {
      return (
         <main>
            <div className="h-100 main-height">
               <Header />
               <div className="container">
                  <div className="row mt-4">
                     <h2>Config Experiment</h2>
                  </div>
                  <div className="row">
                     <div className="col-md-4">
                        <NetworkCard />
                     </div>
                     <div className="col-md-4">
                        <ClientCard />
                     </div>
                  </div>
               </div>
            </div>
         </main>
      );
   }
}
