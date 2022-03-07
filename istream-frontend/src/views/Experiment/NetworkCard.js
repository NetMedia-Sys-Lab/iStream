import React, { Component } from "react";
import Stepper from "src/views/Common/Stepper";
import { getDefaultModules, getUserModules } from "src/api/ModulesAPI";

export default class NetworkCard extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      moduleName: "Network",
      displayModal: false,
      totalNumberOfSteps: 2,
      moduleTypes: ["iStream", "Custom"],
      iStreamModuleOptions: [],
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

   componentDidMount() {
      this.fetchData();
   }

   fetchData = () => {
      getDefaultModules(this.state.moduleName).then((res) => {
         this.setState({ iStreamModuleOptions: res });
      });

      getUserModules(this.state.user, this.state.moduleName).then((res) => {
         this.setState({ userModuleOptions: res });
      });
   };

   onNetworkConfigChange = (e) => {
      this.setState({
         networkConfig: {
            ...this.state.networkConfig,
            [e.target.id]: e.target.value,
         },
      });
   };

   getModuleOptionsList = (list, isModuleType = false) => {
      return list.map((loan, key) => {
         const isCurrent = isModuleType
            ? this.state.selectedModuleType === loan
            : this.state.selectedModule === loan;
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
                        onClick={(e) => {
                           isModuleType
                              ? this.setState({
                                   selectedModuleType: e.target.value,
                                   selectedModule: "",
                                })
                              : this.setState({ selectedModule: e.target.value });
                        }}
                     />
                     {loan}
                  </label>
               </div>
            </div>
         );
      });
   };

   moduleType = () => {
      const moduleTypeOptions = this.getModuleOptionsList(this.state.moduleTypes, true);
      const iStreamModuleOptions = this.getModuleOptionsList(this.state.iStreamModuleOptions);
      const userModuleOptions =
         this.state.userModuleOptions.length === 0 ? (
            <div>No Modules found. Please add a module to proceed.</div>
         ) : (
            this.getModuleOptionsList(this.state.userModuleOptions)
         );

      return (
         <div>
            <h5>Select Module Type</h5>
            <div className="center">{moduleTypeOptions}</div>
            <div>{this.state.selectedModuleType !== "" ? <h5>Select Module</h5> : ""}</div>
            <div>
               {this.state.selectedModuleType !== ""
                  ? this.state.selectedModuleType === "iStream"
                     ? iStreamModuleOptions
                     : userModuleOptions
                  : ""}
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
               isUserModule={this.state.selectedModuleType === "Custom" ? true : false}
               moduleType={this.state.moduleName}
               updateData={this.fetchData}
            />
         </div>
      );
   }
}
