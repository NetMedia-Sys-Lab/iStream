import React, { Component } from "react";
import Stepper from "src/views/Experiment/Common/Stepper";
import EditConfig from "src/views/Experiment/Common/EditConfig";
import {
   getDefaultModules,
   getUserModules,
   getConfigFiles,
   saveExperimentModuleData,
   getModuleData,
   getNetworkConfiguration,
   setNetworkConfiguration,
} from "src/api/ModulesAPI";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { toast } from "react-toastify";

export default class NetworkCard extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      componentName: "Network",
      displayStepperModal: false,
      totalNumberOfSteps: 2,
      moduleTypes: ["iStream", "Custom"],
      iStreamModuleOptions: [],
      userModuleOptions: [],
      userModuleConfigFiles: ["No Config"],
      iStreamModuleConfigFiles: ["No Config"],
      iStreamNetworkManualConfig: false,
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
      displayEditConfigModal: false,
      selectedEditFile: "",
      machineID: "",
   };

   constructor(props) {
      super(props);
      getModuleData(this.state.user, this.state.componentName, this.props.experimentId).then((data) => {
         if (data.type === "iStream" && data.name === "Default Network") {
            getNetworkConfiguration(this.state.user, this.props.experimentId).then((data) => {
               this.setState({
                  networkConfig: {
                     delay: data.delay,
                     packetLoss: data.packetLoss,
                     corruptPacket: data.corruptPacket,
                     bandwidth: data.bandwidth,
                  },
               });
            });
         }

         if (data.name !== "") {
            this.setState({
               selectedModuleType: data.type,
               selectedModule: data.name,
               selectedConfigFile: data.config,
               showModuleConfiguration: true,
               machineID: data.machineID,
               iStreamNetworkManualConfig: data.manualConfig === "true",
            });
            this.getOneModuleConfigFiles(data.name);
         }
      });
      this.fetchData();
   }

   fetchData = () => {
      getDefaultModules(this.state.componentName).then((res) => {
         this.setState({ iStreamModuleOptions: res });
      });

      getUserModules(this.state.user, this.state.componentName).then((res) => {
         this.setState({ userModuleOptions: res });
      });

      getModuleData(this.state.user, this.state.componentName, this.props.experimentId).then((data) => {
         if (data.name !== "") {
            this.setState({
               showModuleConfiguration: true,
               machineID: data.machineID,
            });
         }
      });
   };

   getOneModuleConfigFiles = (moduleName) => {
      getConfigFiles(this.state.user, this.state.componentName, moduleName, this.state.selectedModuleType === "Custom" ? true : false).then(
         (res) => {
            res.unshift("No Config");

            if (this.state.selectedModuleType === "Custom") {
               this.setState({ userModuleConfigFiles: res });
            } else {
               this.setState({ iStreamModuleConfigFiles: res });
            }
         }
      );
   };

   onNetworkConfigChange = (e) => {
      this.setState({
         networkConfig: {
            ...this.state.networkConfig,
            [e.target.id]: e.target.value,
         },
      });
   };

   radioButtonOptions = (list, type) => {
      return list.map((item) => {
         return (
            <div className="form-check" key={item}>
               <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  onChange={() => {
                     if (type === "Module") {
                        this.setState({
                           selectedConfigFile: "",
                           selectedModule: item,
                        });
                        this.getOneModuleConfigFiles(item);
                     } else if (type === "Config") {
                        this.setState({ selectedConfigFile: item });
                     }
                  }}
                  checked={type === "Module" ? this.state.selectedModule === item : this.state.selectedConfigFile === item}
               />
               <label className="form-check-label">{item}</label>
               {type === "Config" && item !== "No Config" ? (
                  <button
                     type="button"
                     className="btn btn-link p-0 m-0 center"
                     onClick={() => this.setState({ selectedEditFile: item, displayEditConfigModal: true, displayStepperModal: false })}
                  >
                     Edit
                  </button>
               ) : (
                  ""
               )}
            </div>
         );
      });
   };

   moduleType = () => {
      const moduleTypeOptions = (
         <DropdownButton
            id="dropdown-basic-button"
            title={this.state.selectedModuleType === "" ? "Select Module Type" : this.state.selectedModuleType}
            variant="secondary"
         >
            {this.state.moduleTypes.map((moduleType) => (
               <Dropdown.Item key={moduleType}>
                  <div
                     onClick={() =>
                        this.setState({
                           selectedModuleType: moduleType,
                           selectedModule: "",
                           selectedConfigFile: "",
                           showModuleConfiguration: false,
                        })
                     }
                  >
                     {moduleType}
                  </div>
               </Dropdown.Item>
            ))}
         </DropdownButton>
      );
      const iStreamModuleOptions = this.radioButtonOptions(this.state.iStreamModuleOptions, "Module");
      const userModuleOptions =
         this.state.userModuleOptions.length === 0 ? (
            <div>No Modules found. Please add a module to proceed.</div>
         ) : (
            this.radioButtonOptions(this.state.userModuleOptions, "Module")
         );

      return (
         <div className="row mb-2">
            <div className="col-6">
               <h5>Select Module Type</h5>
               <div>{moduleTypeOptions}</div>
            </div>
            <div className="col-6">
               <div>{this.state.selectedModuleType !== "" ? <h5>Select Module</h5> : ""}</div>
               <div>
                  {this.state.selectedModuleType !== ""
                     ? this.state.selectedModuleType === "iStream"
                        ? iStreamModuleOptions
                        : userModuleOptions
                     : ""}
               </div>
            </div>
         </div>
      );
   };

   iStreamModuleConfig = () => {
      if (this.state.selectedModuleType !== "iStream") return null;

      return (
         <div>
            <div className="form-check">
               <input
                  className="form-check-input"
                  type="radio"
                  name="DefaultConfig"
                  id="DefaultConfig"
                  onChange={() => {
                     this.setState({ iStreamNetworkManualConfig: false });
                  }}
                  checked={!this.state.iStreamNetworkManualConfig}
               />
               <label className="form-check-label">Default Config</label>
            </div>
            <div className="form-check">
               <input
                  className="form-check-input"
                  type="radio"
                  name="CustomConfig"
                  id="CustomConfig"
                  onChange={() => {
                     this.setState({ iStreamNetworkManualConfig: true });
                  }}
                  checked={this.state.iStreamNetworkManualConfig}
               />
               <label className="form-check-label">Custom Config</label>
            </div>
            <hr />
            {this.state.iStreamNetworkManualConfig ? this.iStreamNetworkCustomConfig() : this.iStreamNetworkDefaultConfig()}
         </div>
      );
   };

   iStreamNetworkDefaultConfig = () => {
      return (
         <div>
            <h5>Network's Config</h5>
            <div>
               <div className="form-group row">
                  <label className="col-6 col-form-label">Delay (ms):</label>
                  <div className="col-6">
                     <input
                        className="form-control"
                        type="number"
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
                        type="number"
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
                        type="number"
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
                        type="number"
                        placeholder="Without Limit"
                        value={this.state.networkConfig.bandwidth === 0 ? "" : this.state.networkConfig.bandwidth}
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

   iStreamNetworkCustomConfig = () => {
      const iStreamModuleConfigFiles =
         this.state.iStreamModuleConfigFiles.length === 0 ? (
            <div>No Config files found. Please add a new config file to proceed.</div>
         ) : (
            this.radioButtonOptions(this.state.iStreamModuleConfigFiles, "Config")
         );

      return (
         <div>
            <h5>Manual Config</h5>
            <div>{iStreamModuleConfigFiles}</div>
         </div>
      );
   };

   userModuleConfig = () => {
      if (this.state.selectedModuleType !== "Custom") return null;
      const userModuleConfigFiles =
         this.state.userModuleConfigFiles.length === 0 ? (
            <div>No Config files found. Please add a new config file to proceed.</div>
         ) : (
            this.radioButtonOptions(this.state.userModuleConfigFiles, "Config")
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
            <strong>Type: </strong>
            {this.state.selectedModuleType}
            <br />
            <strong>Name: </strong>
            {this.state.selectedModule}
            <br />
            {this.state.machineID !== "" && this.state.machineID !== "0" ? (
               <div>
                  <strong>Machine IP: </strong>
                  {this.state.machineID}
               </div>
            ) : (
               ""
            )}
         </div>
      );
      if (this.state.selectedModuleType === "iStream" && !this.state.iStreamNetworkManualConfig)
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
               {this.state.networkConfig.bandwidth === 0 ? "Without limit" : this.state.networkConfig.bandwidth + "Mbit"}
            </div>
         );
      else
         return (
            <div>
               {template}
               <strong>Config: </strong>
               {this.state.selectedConfigFile}
            </div>
         );
   };

   onSubmit = () => {
      this.setState({ showModuleConfiguration: true });

      const data = {
         userId: this.state.user.userId,
         username: this.state.user.username,
         componentName: this.state.componentName,
         experimentId: this.props.experimentId,
         selectedModuleType: this.state.selectedModuleType,
         selectedModule: this.state.selectedModule,
         selectedConfigFile: this.state.selectedConfigFile,
         iStreamNetworkManualConfig: this.state.iStreamNetworkManualConfig,
      };

      saveExperimentModuleData(data).then((res) => {
         toast.success(res);
      });

      if (this.state.selectedModule === "Default Network" && !this.state.iStreamNetworkManualConfig) {
         const networkData = {
            userId: this.state.user.userId,
            username: this.state.user.username,
            experimentId: this.props.experimentId,
            delay: Number(this.state.networkConfig.delay),
            packetLoss: Number(this.state.networkConfig.packetLoss),
            corruptPacket: Number(this.state.networkConfig.corruptPacket),
            bandwidth: Number(this.state.networkConfig.bandwidth),
         };
         setNetworkConfiguration(networkData).then((res) => {});
      }
   };

   render() {
      return (
         <div className="row justify-content-center mx-1">
            <div
               className="center-container"
               style={{ borderRadius: "10px", padding: "20px", cursor: "pointer" }}
               onClick={() => this.setState({ displayStepperModal: true })}
            >
               <h4 className="text-center">
                  <i className="fa fa-wifi" style={{ color: "#244D5B" }}></i>
                  <br />
                  {this.state.componentName}
               </h4>
               {this.showModuleConfig()}
            </div>
            <Stepper
               display={this.state.displayStepperModal}
               totalNumberOfSteps={this.state.totalNumberOfSteps}
               validNextStep={this.state.selectedModule !== "" ? true : false}
               steps={[this.moduleType(), [this.iStreamModuleConfig(), this.userModuleConfig()]]}
               onSubmit={this.onSubmit}
               toggleDisplay={() => this.setState({ displayStepperModal: !this.state.displayStepperModal })}
               isUserModule={this.state.selectedModuleType === "Custom"}
               componentName={this.state.componentName}
               updateData={this.fetchData}
               updateConfigFiles={this.getOneModuleConfigFiles}
               selectedModule={this.state.selectedModule}
               experimentId={this.props.experimentId}
               hideAddNewConfig={
                  !(
                     this.state.selectedModuleType === "Custom" ||
                     (this.state.selectedModuleType === "iStream" && this.state.iStreamNetworkManualConfig)
                  )
               }
            />
            {this.state.displayEditConfigModal ? (
               <EditConfig
                  display={this.state.displayEditConfigModal}
                  configName={this.state.selectedEditFile}
                  moduleName={this.state.selectedModule}
                  componentName={this.state.componentName}
                  detached={() => this.setState({ displayEditConfigModal: false, displayStepperModal: true })}
               />
            ) : (
               ""
            )}
         </div>
      );
   }
}
