import React, { Component } from "react";
import Stepper from "src/views/Common/Stepper";

export default class NetworkCard extends Component {
   state = {
      displayModal: false,
      totalNumberOfSteps: 2,
      moduleTypes: ["iStream", "Custom"],
      iStreamModuleOptions: ["Default Network"],
      userModuleOptions: [],
      selectedModuleType: "",
      selectedModule: "",
      networkConfig: {
         delay: 0,
         packetLoss: 0,
         corruptPacket: 0,
         bandwidth: 0,
      },
      showModuleConfiguration: false,
   };

   onNetworkConfigChange = (e) => {
      this.setState({
         networkConfig: {
            ...this.state.networkConfig,
            [e.target.id]: e.target.value,
         },
      });
   };

   moduleType = () => {
      const moduleTypeOptions = this.state.moduleTypes.map((loan, key) => {
         const isCurrent = this.state.selectedModuleType === loan;
         return (
            <div key={key} className="radioPad">
               <div>
                  <label
                     className={
                        isCurrent ? "radioPadWrapper radioPadWrapperSelected" : "radioPadWrapper"
                     }
                  >
                     <input
                        className="radioPadRadio"
                        type="radio"
                        value={loan}
                        onClick={(e) =>
                           this.setState({ selectedModuleType: e.target.value, selectedModule: "" })
                        }
                     />
                     {loan}
                  </label>
               </div>
            </div>
         );
      });

      const iStreamModuleOptions = this.state.iStreamModuleOptions.map((loan, key) => {
         const isCurrent = this.state.selectedModule === loan;
         return (
            <div key={key} className="radioPad">
               <div>
                  <label
                     className={
                        isCurrent ? "radioPadWrapper radioPadWrapperSelected" : "radioPadWrapper"
                     }
                  >
                     <input
                        className="radioPadRadio"
                        type="radio"
                        value={loan}
                        onClick={(e) => this.setState({ selectedModule: e.target.value })}
                     />
                     {loan}
                  </label>
               </div>
            </div>
         );
      });

      return (
         <div>
            <h5>Select Module Type</h5>
            <div className="center">{moduleTypeOptions}</div>
            <div>{this.state.selectedModuleType !== "" ? <h5>Select Module</h5> : ""}</div>
            <div className="center">
               {this.state.selectedModuleType === "iStream" ? iStreamModuleOptions : ""}
            </div>
         </div>
      );
   };

   configDefaultNetworkModule = () => {
      if (this.state.selectedModule !== "Default Network") return null;

      return (
         <div>
            <h5>Config Module</h5>
            <div>
               <div className="form-group row">
                  <label className="col-6 col-form-label">Delay (ms):</label>
                  <div className="col-6">
                     <input
                        className="form-control"
                        type="text"
                        value={this.state.networkConfig.delay}
                        id="delay"
                        onChange={this.onNetworkConfigChange}
                        required
                     />
                  </div>
               </div>
               <div className="form-group row mt-1">
                  <label className="col-6 col-form-label">Packet Loss (%):</label>
                  <div className="col-6">
                     <input
                        className="form-control"
                        type="text"
                        value={this.state.networkConfig.packetLoss}
                        id="packetLoss"
                        onChange={this.onNetworkConfigChange}
                        required
                     />
                  </div>
               </div>
               <div className="form-group row mt-1">
                  <label className="col-6 col-form-label">Corrupt Packet (%):</label>
                  <div className="col-6">
                     <input
                        className="form-control"
                        type="text"
                        value={this.state.networkConfig.corruptPacket}
                        id="corruptPacket"
                        onChange={this.onNetworkConfigChange}
                        required
                     />
                  </div>
               </div>
               <div className="form-group row mt-1">
                  <label className="col-6 col-form-label">Bandwidth Limit (Mbit):</label>
                  <div className="col-6">
                     <input
                        className="form-control"
                        type="text"
                        placeholder="Without Limit"
                        value={
                           this.state.networkConfig.bandwidth === 0
                              ? ""
                              : this.state.networkConfig.bandwidth
                        }
                        id="bandwidth"
                        onChange={this.onNetworkConfigChange}
                        required
                     />
                  </div>
               </div>
            </div>
         </div>
      );
   };

   showModuleConfig = () => {
      if (this.state.showModuleConfiguration === true)
         return (
            <div>
               <hr />
               <strong> Module Type: </strong>
               {this.state.selectedModuleType}
               <br />
               <strong> Module Selected: </strong>
               {this.state.selectedModule}
               <br />
               <strong> Delay: </strong>
               {this.state.networkConfig.delay} s
               <br />
               <strong> Packet Loss: </strong>
               {this.state.networkConfig.packetLoss} %
               <br />
               <strong> Corrupt Packet: </strong>
               {this.state.networkConfig.corruptPacket} %
               <br />
               <strong> Bandwidth: </strong>
               {this.state.networkConfig.bandwidth === 0
                  ? "Without limit"
                  : this.state.networkConfig.bandwidth + "Mbit"}
            </div>
         );
   };

   render() {
      return (
         <div className="row justify-content-center mx-1">
            <div
               className="center-container"
               style={{ borderRadius: "10px", padding: "20px", cursor: "pointer" }}
               onClick={() => this.setState({ displayModal: true })}
            >
               <h4 className="text-center">
                  <i className="fa fa-wifi" style={{ color: "#244D5B" }}></i>
                  <br />
                  Network Module
               </h4>
               {this.showModuleConfig()}
            </div>
            <Stepper
               display={this.state.displayModal}
               totalNumberOfSteps={this.state.totalNumberOfSteps}
               validNextStep={this.state.selectedModule !== "" ? true : false}
               steps={[this.moduleType(), this.configDefaultNetworkModule()]}
               onSubmit={() => this.setState({ showModuleConfiguration: true })}
               toggleDisplay={() => this.setState({ displayModal: !this.state.displayModal })}
            />
         </div>
      );
   }
}
