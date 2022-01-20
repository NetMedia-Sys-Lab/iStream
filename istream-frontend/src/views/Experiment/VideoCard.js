import React, { Component } from "react";

export default class Experiment extends Component {
   render() {
      return (
         <div className="row justify-content-center mx-1">
            <div className="center-container" style={{ "border-radius": "10px", padding: "20px" }}>
               <h4 className="text-center">
                  <i className="fa fa-play" style={{ color: "#244D5B" }}></i>
                  <br />
                  Video Selection
               </h4>
               <hr />
               <div className="text-center">
                  <button className="btn btn-primary" type="button">
                     configure
                     <i className="fa fa-chevron-down" />
                  </button>
               </div>
            </div>
         </div>
      );
   }
}
