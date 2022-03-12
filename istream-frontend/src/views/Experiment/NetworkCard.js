import React, { Component } from "react";
import Stepper from "src/views/Experiment/Common/Stepper";
import { getDefaultModules, getUserModules, getConfigFiles } from "src/api/ModulesAPI";

export default class NetworkCard extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      componentName: "Network",
      displayModal: false,
      totalNumberOfSteps: 2,
      moduleTypes: ["iStream", "Custom"],
      iStreamModuleOptions: [],
      userModuleOptions: [],
      userModuleConfigFiles: ["No Config"],
      selectedModuleType: "",
      selectedModule: "",
      selectedConfigFile: "",
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
      getDefaultModules(this.state.componentName).then((res) => {
         this.setState({ iStreamModuleOptions: res });
      });

      getUserModules(this.state.user, this.state.componentName).then((res) => {
         this.setState({ userModuleOptions: res });
      });
   };

   getOneModuleConfigFiles = (moduleName) => {
      getConfigFiles(this.state.user, this.state.componentName, moduleName).then((res) => {
         res.unshift("No Config");
         this.setState({ userModuleConfigFiles: res });
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

   getOptionsList = (list, type) => {
      return list.map((loan, key) => {
         let isCurrent;
         if (type === "ModuleType") isCurrent = this.state.selectedModuleType === loan;
         else if (type === "Module") isCurrent = this.state.selectedModule === loan;
         else if (type === "Config") isCurrent = this.state.selectedConfigFile === loan;

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
                           if (type === "ModuleType") {
                              this.setState({
                                 selectedModuleType: e.target.value,
                                 selectedModule: "",
                                 selectedConfigFile: "",
                                 showModuleConfiguration: false,
                              });
                           } else if (type === "Module") {
                              this.setState({
                                 selectedModule: e.target.value,
                                 selectedConfigFile: "",
                                 showModuleConfiguration: false,
                              });
                              this.getOneModuleConfigFiles(e.target.value);
                           } else if (type === "Config") {
                              this.setState({ selectedConfigFile: e.target.value });
                           }
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
      const moduleTypeOptions = this.getOptionsList(this.state.moduleTypes, "ModuleType");
      const iStreamModuleOptions = this.getOptionsList(this.state.iStreamModuleOptions, "Module");
      const userModuleOptions =
         this.state.userModuleOptions.length === 0 ? (
            <div>No Modules found. Please add a module to proceed.</div>
         ) : (
            this.getOptionsList(this.state.userModuleOptions, "Module")
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
      if (
         this.state.selectedModuleType !== "iStream" &&
         this.state.selectedModule !== "Default Network"
      )
         return null;

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

   configUserModule = () => {
      if (this.state.selectedModuleType !== "Custom") return null;

      const userModuleConfigFiles =
         this.state.userModuleConfigFiles.length === 0 ? (
            <div>No Config files found. Please add a new config file to proceed.</div>
         ) : (
            this.getOptionsList(this.state.userModuleConfigFiles, "Config")
         );

      return (
         <div>
            <h5>Config Module</h5>
            <div>{userModuleConfigFiles}</div>
         </div>
      );
   };

   showModuleConfig = () => {
      if (this.state.showModuleConfiguration !== true) return;
      let template = (
         <div>
            <hr />
            <strong> Module Type: </strong>
            {this.state.selectedModuleType}
            <br />
            <strong> Module Selected: </strong>
            {this.state.selectedModule}
            <br />
         </div>
      );
      if (this.state.selectedModuleType === "iStream")
         return (
            <div>
               {template}
               <strong> Delay: </strong>
               {this.state.networkConfig.delay}s
               <br />
               <strong> Packet Loss: </strong>
               {this.state.networkConfig.packetLoss}%
               <br />
               <strong> Corrupt Packet: </strong>
               {this.state.networkConfig.corruptPacket}%
               <br />
               <strong> Bandwidth: </strong>
               {this.state.networkConfig.bandwidth === 0
                  ? "Without limit"
                  : this.state.networkConfig.bandwidth + "Mbit"}
            </div>
         );
      else
         return (
            <div>
               {template}
               <strong>Config File Name: </strong>
               {this.state.selectedConfigFile}
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
                  {this.state.componentName} Module
               </h4>
               {this.showModuleConfig()}
            </div>
            <Stepper
               display={this.state.displayModal}
               totalNumberOfSteps={this.state.totalNumberOfSteps}
               validNextStep={this.state.selectedModule !== "" ? true : false}
               steps={[
                  this.moduleType(),
                  [this.configDefaultNetworkModule(), this.configUserModule()],
               ]}
               onSubmit={() => this.setState({ showModuleConfiguration: true })}
               toggleDisplay={() => this.setState({ displayModal: !this.state.displayModal })}
               isUserModule={this.state.selectedModuleType === "Custom" ? true : false}
               componentName={this.state.componentName}
               updateData={this.fetchData}
               updateConfigFiles={this.getOneModuleConfigFiles}
               selectedModule={this.state.selectedModule}
            />
         </div>
      );
   }
}
