import React, { Component } from "react";
import Header from "src/views/Common/Header";
import VideoCard from "src/views/Experiment/VideoCard";

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
                     <div className="col-md-3">
                        <VideoCard />
                     </div>
                     <div className="col-md-3">
                        <VideoCard />
                     </div>
                     <div className="col-md-3">
                        <VideoCard />
                     </div>
                     <div className="col-md-3">
                        <VideoCard />
                     </div>
                  </div>
               </div>
            </div>
         </main>
      );
   }
}
