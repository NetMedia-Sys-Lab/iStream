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
            {this.props.dockerConfig.cpus === 0 ? "No Limitation" : this.props.dockerConfig.cpus}
            <br />
            <div>
               <strong>Memory: </strong>
               {this.props.dockerConfig.memory === 0 ? "No Limitation" : this.props.dockerConfig.memory + " GB"}
            </div>
         </div>
      );
   };

   searchKey(obj, key) {
      for (let k in obj) {
         if (k === key) {
            return obj[k];
         }
         if (typeof obj[k] === "object") {
            let result = this.searchKey(obj[k], key);
            if (result !== undefined) {
               return result;
            }
         }
      }
      return undefined;
   }

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
            let value = this.searchKey(this.props.moduleData.simpleConfig.parameters, key);

            return (
               <div key={index}>
                  <strong> {value["title"]}: </strong>
                  {key === "bandwidth" && this.props.moduleData.simpleConfig.values[key] === 0
                     ? "Without limit"
                     : String(this.props.moduleData.simpleConfig.values[key])}
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
            {this.props.moduleData.name === "DASH.js" ? (
               <div>
                  <hr />
                  {this.moduleConfig()}
               </div>
            ) : (
               <div>
                  <hr />
                  {this.dockerConfig()}
                  <hr />
                  {this.moduleConfig()}
               </div>
            )}
         </div>
      );
   }
}
