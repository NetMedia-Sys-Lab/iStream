import React, { Component } from "react";

export default class VideoCard extends Component {
   state = {
      showConfig: false,
   };

   render() {
      return (
         <div className="row justify-content-center mx-1">
            <div className="center-container" style={{ borderRadius: "10px", padding: "20px" }}>
               <h4 className="text-center">
                  <i className="fa fa-play" style={{ color: "#244D5B" }}></i>
                  <br />
                  Video Selection
               </h4>
               <hr />
               <div className="text-center">
                  <button
                     className="btn btn-primary"
                     type="button"
                     onClick={() => this.setState({ showConfig: !this.state.showConfig })}
                  >
                     configure &nbsp;
                     <i className="fa fa-chevron-down" />
                  </button>
               </div>
               {this.state.showConfig ? <div>
                  test
                  <br />
                  <br />
                  <br />
                  <br />
                  test
               </div>:""}
            </div>
         </div>
      );
   }
}
