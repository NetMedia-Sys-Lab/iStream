import React, { Component } from "react";
import Stepper from "src/views/Experiment/Common/Stepper";
import EditConfig from "src/views/Experiment/Common/EditConfig";
import { Dropdown, DropdownButton } from "react-bootstrap";
import {
   getDefaultModules,
   getUserModules,
   getConfigFiles,
   getModuleData,
   saveExperimentModuleData,
   setHeadlessPlayerConfiguration,
   getHeadlessPlayerConfiguration,
} from "src/api/ModulesAPI";
import InformationButton from "src/views/Common/InformationButton";
import { toast } from "react-toastify";

export default class ClientCard extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      componentName: "Client",
      displayModal: false,
      totalNumberOfSteps: 2,
      moduleTypes: ["iStream", "Custom"],
      iStreamModuleOptions: [],
      userModuleOptions: [],
      userModuleConfigFiles: ["No Config"],
      iStreamModuleConfigFiles: ["No Config"],
      selectedModuleType: "",
      selectedModule: "",
      selectedConfigFile: "",
      showModuleConfiguration: false,
      displayEditConfigModal: false,
      selectedEditFile: "",
      machineID: "",
      headlessPlayerConfig: {
         adaptationAlgorithmOptions: ["Buffer-based ABR", "Bandwidth-based ABR", "Hybrid ABR"],
         selectedAdaptationAlgorithm: "Bandwidth-based ABR",
         mpdFileName: "output.mpd",
         connectingPort: 8080,
      },
   };

   constructor(props) {
      super(props);
      getModuleData(this.state.user, this.state.componentName, this.props.experimentId).then((data) => {
         if (data.type === "iStream" && data.name === "Headless Player ABR") {
            getHeadlessPlayerConfiguration(this.state.user, this.props.experimentId).then((data) => {
               this.setState({
                  headlessPlayerConfig: {
                     adaptationAlgorithmOptions: this.state.headlessPlayerConfig.adaptationAlgorithmOptions,
                     selectedAdaptationAlgorithm: data.adaptationAlgorithm,
                     mpdFileName: data.mpdFileName,
                     connectingPort: data.connectingPort,
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
                        if (item === "Dash.js") {
                           this.setState({ machineID: "" });
                        }
                        this.getOneModuleConfigFiles(item);
                     } else if (type === "Config") {
                        this.setState({ selectedConfigFile: item });
                     } else if (type === "headlessPlayer") {
                        this.setState({
                           headlessPlayerConfig: {
                              ...this.state.headlessPlayerConfig,
                              selectedAdaptationAlgorithm: item,
                           },
                        });
                     }
                  }}
                  checked={
                     type === "Module"
                        ? this.state.selectedModule === item
                        : type === "Config"
                        ? this.state.selectedConfigFile === item
                        : this.state.headlessPlayerConfig.selectedAdaptationAlgorithm === item
                  }
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
                  <div onClick={() => this.setState({ selectedModuleType: moduleType })}>{moduleType}</div>
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

   iStreamModuleConfig = () => {
      if (this.state.selectedModuleType !== "iStream") return null;

      const iStreamModuleConfigFiles =
         this.state.iStreamModuleConfigFiles.length === 0 ? (
            <div>No Config files found. Please add a new config file to proceed.</div>
         ) : (
            this.radioButtonOptions(this.state.iStreamModuleConfigFiles, "Config")
         );

      return (
         <div>
            <h5>Config Module</h5>
            <div>{iStreamModuleConfigFiles}</div>
         </div>
      );
   };

   onHeadlessPlayerConfigChange = (e) => {
      this.setState({
         networkConfig: {
            ...this.state.networkConfig,
            [e.target.id]: e.target.value,
         },
      });
   };

   headlessPlayerModuleConfig = () => {
      if (this.state.selectedModuleType !== "iStream" || this.state.selectedModule !== "Headless Player ABR") return null;

      return (
         <div>
            <h5>Config</h5>
            <div className="form-group row">
               <label className="col-6 col-form-label">MPD Name:</label>
               <div className="col-6">
                  <input
                     className="form-control"
                     value={this.state.headlessPlayerConfig.mpdFileName}
                     id="headlessPlayerMPDname"
                     onChange={(e) => {
                        this.setState({
                           headlessPlayerConfig: {
                              ...this.state.headlessPlayerConfig,
                              mpdFileName: e.target.value,
                           },
                        });
                     }}
                     required
                  />
               </div>
            </div>
            <div className="row">
               <p className="col-6 center">Adaptation Algorithm Method:</p>
               <div className="col-6">
                  {this.radioButtonOptions(this.state.headlessPlayerConfig.adaptationAlgorithmOptions, "headlessPlayer")}
               </div>
            </div>
            <div className="form-group row">
               <div className="col-6">
                  <label className="col-form-label">
                     Server/Network Port:
                     <InformationButton message="If you set your own Network or Server Modules provide the port that Headless Player should connect to." />
                  </label>
               </div>
               <div className="col-6">
                  <input
                     className="form-control"
                     value={this.state.headlessPlayerConfig.connectingPort}
                     id="headlessPlayerPort"
                     onChange={(e) => {
                        this.setState({
                           headlessPlayerConfig: {
                              ...this.state.headlessPlayerConfig,
                              connectingPort: e.target.value,
                           },
                        });
                     }}
                     required
                  />
               </div>
            </div>
         </div>
      );
   };

   showModuleConfig = () => {
      if (this.state.showModuleConfiguration !== true) return;

      let baseTemplate = (
         <div>
            <hr />
            <strong>Type: </strong>
            {this.state.selectedModuleType}
            <br />
            <strong>Name: </strong>
            {this.state.selectedModule}
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

      let headlessPlayerConfig = "";
      if (this.state.selectedModuleType === "iStream" && this.state.selectedModule === "Headless Player ABR") {
         headlessPlayerConfig = (
            <div>
               <strong>MPD file: </strong>
               {this.state.headlessPlayerConfig.mpdFileName}
               <br />
               <strong>Adaptation Algorithm: </strong>
               {this.state.headlessPlayerConfig.selectedAdaptationAlgorithm}
               <br />
               <strong>Server/Network Port: </strong>
               {this.state.headlessPlayerConfig.connectingPort}
            </div>
         );
      }

      return (
         <div style={{ whiteSpace: "nowrap" }}>
            {baseTemplate}
            <hr />
            {headlessPlayerConfig}
            {this.state.selectedConfigFile !== "" ? (
               <div>
                  <strong>Config: </strong>
                  {this.state.selectedConfigFile}
               </div>
            ) : (
               ""
            )}
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
      };

      saveExperimentModuleData(data).then((res) => {
         toast.success(res);
      });

      if (this.state.selectedModuleType === "iStream" && this.state.selectedModule === "Headless Player ABR") {
         const headlessPlayerData = {
            userId: this.state.user.userId,
            username: this.state.user.username,
            experimentId: this.props.experimentId,
            adaptationAlgorithm: this.state.headlessPlayerConfig.selectedAdaptationAlgorithm,
            mpdFileName: this.state.headlessPlayerConfig.mpdFileName,
            connectingPort: this.state.headlessPlayerConfig.connectingPort,
         };
         setHeadlessPlayerConfiguration(headlessPlayerData).then((res) => {});
      }
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
                  <i className="fa fa-desktop" style={{ color: "#244D5B" }}></i>
                  <br />
                  {this.state.componentName}
               </h4>
               {this.showModuleConfig()}
            </div>
            <Stepper
               display={this.state.displayModal}
               totalNumberOfSteps={this.state.totalNumberOfSteps}
               validNextStep={this.state.selectedModule !== "" ? true : false}
               steps={[this.moduleType(), [this.headlessPlayerModuleConfig(), this.userModuleConfig()]]}
               onSubmit={this.onSubmit}
               toggleDisplay={() => this.setState({ displayModal: !this.state.displayModal })}
               isUserModule={this.state.selectedModuleType === "Custom" ? true : false}
               componentName={this.state.componentName}
               updateData={this.fetchData}
               updateConfigFiles={this.getOneModuleConfigFiles}
               selectedModule={this.state.selectedModule}
               experimentId={this.props.experimentId}
               hideAddNewConfig={
                  !(
                     this.state.selectedModuleType === "Custom" ||
                     (this.state.selectedModuleType === "iStream" && this.state.selectedModule !== "Headless Player ABR")
                  )
               }
            />
            {this.state.displayEditConfigModal ? (
               <EditConfig
                  display={this.state.displayEditConfigModal}
                  configName={this.state.selectedEditFile}
                  moduleName={this.state.selectedModule}
                  componentName={this.state.componentName}
                  isUserModule={this.state.selectedModuleType === "Custom" ? true : false}
                  detached={() => this.setState({ displayEditConfigModal: false, displayStepperModal: true })}
               />
            ) : (
               ""
            )}
         </div>
      );
   }
}
