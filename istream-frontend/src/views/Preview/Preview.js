import React, { Component } from "react";

export default class Preview extends Component {
   redirectToLoginPage = () => {
      window.location.href = "/login";
   };

   render() {
      return (
         <main>
            <div className="container h-100">
               <div className="row justify-content-center align-items-center main-height">
                  <div className="col-md-9 center-container">
                     <h1 className="center-text">Welcome to iStream</h1>
                     <h3 className="center-text">
                        A Research Platform for Multimedia Streaming
                     </h3>
                     <h5 className="center-text">
                        Developed by Navid Akbari, under supervision of Dr. Mea
                        Wang and Dr. Diwakar Krishnamurthy
                     </h5>

                     <div className="row justify-content-center">
                        <div className="col-sm-4">
                           <button
                              className="green-button"
                              onClick={this.redirectToLoginPage}
                           >
                              Start
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </main>
      );
   }
}
