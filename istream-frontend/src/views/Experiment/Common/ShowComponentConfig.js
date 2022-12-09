import React, { Component } from "react";

export default class ShowComponentConfig extends Component {
   moduleInfo = () => {
      return (
         <div>
            <strong>Name: </strong>
            {this.props.moduleData.name}
            <br />
            <strong>Type: </strong>
            {this.props.moduleData.type}
            <br />
            {this.props.moduleData.machineID !== "" && this.props.moduleData.machineID !== "0" ? (
               <div>
                  <strong>Machine IP: </strong>
                  {this.props.moduleData.machineID}
               </div>
            ) : (
               ""
            )}
         </div>
      );
   };

   dockerConfig = () => {
      return (
         <div>
            <strong>Port: </strong>
            {this.props.dockerConfig.port}
            <br />
            <strong>CPUs: </strong>
            {this.props.dockerConfig.cpus}
            <br />
            <div>
               <strong>Memory: </strong>
               {this.props.dockerConfig.memory}
            </div>
         </div>
      );
   };

   moduleConfig = () => {
      let configTemplate = "";
      if (this.props.moduleData.advanceConfiguration === true) {
         configTemplate = (
            <div>
               <strong>Config: </strong>
               {this.props.moduleData.advanceConfig.selected}
            </div>
         );
      } else {
         configTemplate = Object.keys(this.props.moduleData.simpleConfig.values).map((key, index) => {
            return (
               <div key={index}>
                  <strong> {this.props.moduleData.simpleConfig.parameters["properties"][key]["title"]}: </strong>
                  {key === "bandwidth" && this.props.moduleData.simpleConfig.values[key] === 0
                     ? "Without limit"
                     : this.props.moduleData.simpleConfig.values[key]}
               </div>
            );
         });
      }
      return <div>{configTemplate}</div>;
   };

   render() {
      if (this.props.show === false) return;

      return (
         <div>
            <hr />
            {this.moduleInfo()}
            <hr />
            {this.dockerConfig()}
            <hr />
            {this.moduleConfig()}
         </div>
      );
   }
}
