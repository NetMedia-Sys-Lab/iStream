import React, { Component } from "react";

export default class ProgressBar extends Component {
   render() {
      return (
         <div className="progress">
            <div
               className="progress-bar progress-bar-striped progress-bar-animated"
               role="progressbar"
               style={{
                  width:
                     parseInt(parseFloat(100 / this.props.numberOfSteps) * this.props.value) + "%",
               }}
               aria-valuemin="0"
               aria-valuemax="100"
            ></div>
         </div>
      );
   }
}
