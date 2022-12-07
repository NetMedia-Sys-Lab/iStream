import React, { Component } from "react";
import Stepper from "src/views/Experiment/Common/Stepper";
import { Button, Modal } from "react-bootstrap";

import EditConfig from "src/views/Experiment/Common/EditConfig";
import {
   getDefaultModules,
   getUserModules,
   getModuleData,
   saveExperimentModuleData,
   getModuleParameters,
   getModuleScripts,
   getNetworkConfiguration,
   setNetworkConfiguration,
} from "src/api/ModulesAPI";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { toast } from "react-toastify";
import Form from "@rjsf/core";

export default class NewNetworkCard extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      componentName: "Network",
      displayStepperModal: false,
      totalNumberOfSteps: 2,
      modules: {
         types: ["iStream", "Custom"],
         names: {
            iStream: [],
            custom: [],
         },
      },
      selectedModule: {
         type: "",
         name: "",
         machineID: "",
         selectedScript: "",
         allScripts: [],
         parameters: {},
      },
      showModuleConfiguration: false,
      displayEditConfigModal: false,
      selectedEditFile: "",
   };

   constructor(props) {
      super(props);

      this.fetchData();

      getModuleData(this.state.user, this.state.componentName, this.props.experimentId).then((data) => {
         //    if (data.type === "iStream" && data.name === "Default Network") {
         //       getNetworkConfiguration(this.state.user, this.props.experimentId).then((data) => {
         //          this.setState({
         //             networkConfig: {
         //                port: data.port,
         //                delay: data.delay,
         //                packetLoss: data.packetLoss,
         //                corruptPacket: data.corruptPacket,
         //                bandwidth: data.bandwidth,
         //             },
         //          });
         //       });
         //    }

         if (data.name !== "") {
            // this.setState({
            //    selectedModuleType: data.type,
            //    selectedModule: data.name,
            //    selectedScript: data.config,
            //    showModuleConfiguration: true,
            //    machineID: data.machineID,
            //    iStreamNetworkManualConfig: data.manualConfig === "true",
            // });
            // this.getOneModuleConfiguration(data.name);
         }
      });
   }

   fetchData = () => {
      getDefaultModules(this.state.componentName).then((res) => {
         let tempState = this.state.modules;
         tempState.names.iStream = res;
         this.setState({ modules: tempState });
      });

      getUserModules(this.state.user, this.state.componentName).then((res) => {
         let tempState = this.state.modules;
         tempState.names.custom = res;
         this.setState({ modules: tempState });
      });

      // getModuleData(this.state.user, this.state.componentName, this.props.experimentId).then((data) => {
      //    if (data.name !== "") {
      //       this.setState({
      //          showModuleConfiguration: true,
      //          machineID: data.machineID,
      //       });
      //    }
      // });
   };

   getOneModuleConfiguration = (moduleName) => {
      getModuleScripts(
         this.state.user,
         this.state.componentName,
         moduleName,
         this.state.selectedModuleType === "Custom" ? true : false
      ).then((res) => {
         res.unshift("No Script");
         let tempState = this.state.selectedModule;
         tempState.selectedScript = res;
         this.setState({ selectedModule: tempState });
      });

      getModuleParameters(
         this.state.user,
         this.state.componentName,
         moduleName,
         this.state.selectedModule.type === "Custom" ? true : false
      ).then((res) => {
         console.log(res);
         let tempState = this.state.selectedModule;
         tempState.parameters = res;
         this.setState({ selectedModule: tempState });
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
                        let tempState = this.state.selectedModule;
                        tempState.name = item;
                        tempState.selectedScript = "";
                        this.setState({ selectedModule: tempState });
                        this.getOneModuleConfiguration(item);
                     } else if (type === "Config") {
                        let tempState = this.state.selectedModule;
                        tempState.selectedScript = item;
                        this.setState({ selectedModule: tempState });
                     }
                  }}
                  checked={type === "Module" ? this.state.selectedModule.name === item : this.state.selectedModule.selectedScript === item}
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

   moduleSelection = () => {
      const moduleTypeOptions = (
         <DropdownButton
            id="dropdown-basic-button"
            title={this.state.selectedModule.type === "" ? "Select Module Type" : this.state.selectedModule.type}
            variant="secondary"
         >
            {this.state.modules.types.map((moduleType) => (
               <Dropdown.Item key={moduleType}>
                  <div
                     onClick={() => {
                        let tempState = this.state.selectedModule;
                        tempState.type = moduleType;
                        this.setState({
                           selectedModule: tempState,
                           showModuleConfiguration: false,
                        });
                     }}
                  >
                     {moduleType}
                  </div>
               </Dropdown.Item>
            ))}
         </DropdownButton>
      );
      const iStreamModuleOptions = this.radioButtonOptions(this.state.modules.names.iStream, "Module");
      const userModuleOptions =
         this.state.modules.names.custom.length === 0 ? (
            <div>No Modules found. Please add a module to proceed.</div>
         ) : (
            this.radioButtonOptions(this.state.modules.names.custom, "Module")
         );

      return (
         <div className="row mb-2">
            <div className="col-6">
               <h5>Select Module Type</h5>
               <div>{moduleTypeOptions}</div>
            </div>
            <div className="col-6">
               <div>{this.state.selectedModule.type !== "" ? <h5>Select Module</h5> : ""}</div>
               <div>
                  {this.state.selectedModule.type !== ""
                     ? this.state.selectedModule.type === "iStream"
                        ? iStreamModuleOptions
                        : userModuleOptions
                     : ""}
               </div>
            </div>
         </div>
      );
   };

   iStreamModuleConfig = () => {
      if (this.state.selectedModule.type !== "iStream") return null;

      return (
         <Form schema={this.state.selectedModule.parameters} onChange={(values) => console.log(values.formData)}>
            <Button
               className="float-end"
               // onClick={() => {
               //    this.props.onSubmit();
               //    this.props.toggleDisplay();
               //    this.setState({ currentStep: 1 });
               // }}
            >
               Submit
            </Button>
         </Form>
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
      let baseTemplate = (
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
            <hr />
         </div>
      );

      let portTemplate = "";
      if (this.state.selectedModuleType === "iStream") {
         portTemplate = (
            <div>
               <strong>Port: </strong>
               {this.state.networkConfig.port}
            </div>
         );
      }

      if (this.state.selectedModuleType === "iStream" && !this.state.iStreamNetworkManualConfig)
         return (
            <div>
               {baseTemplate}
               {portTemplate}
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
               {this.state.networkConfig.bandwidth === 0 || this.state.networkConfig.bandwidth === "0"
                  ? "Without limit"
                  : this.state.networkConfig.bandwidth + "Kbps"}
            </div>
         );
      else
         return (
            <div style={{ whiteSpace: "nowrap" }}>
               {baseTemplate}
               {portTemplate}
               <strong>Config: </strong>
               {this.state.selectedScript}
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
         selectedScript: this.state.selectedScript,
         iStreamNetworkManualConfig: this.state.iStreamNetworkManualConfig,
      };

      saveExperimentModuleData(data).then((res) => {
         toast.success(res);
      });

      if (this.state.selectedModuleType === "iStream" && this.state.selectedModule === "Default Network") {
         const networkData = {
            userId: this.state.user.userId,
            username: this.state.user.username,
            experimentId: this.props.experimentId,
            port: Number(this.state.networkConfig.port),
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
               {/* {this.showModuleConfig()} */}
            </div>

            <Stepper
               display={this.state.displayStepperModal}
               totalNumberOfSteps={this.state.totalNumberOfSteps}
               validNextStep={this.state.selectedModule.name !== "" ? true : false}
               steps={[this.moduleSelection(), [this.iStreamModuleConfig(), this.userModuleConfig()]]}
               onSubmit={this.onSubmit}
               toggleDisplay={() => this.setState({ displayStepperModal: !this.state.displayStepperModal })}
               isUserModule={this.state.selectedModule.type === "Custom"}
               componentName={this.state.componentName}
               updateData={this.fetchData}
               updateConfigFiles={this.getOneModuleConfiguration}
               selectedModule={this.state.selectedModule.name}
               experimentId={this.props.experimentId}
               // hideAddNewConfig={
               //    !(
               //       this.state.selectedModuleType === "Custom" ||
               //       (this.state.selectedModuleType === "iStream" && this.state.iStreamNetworkManualConfig)
               //    )
               // }
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
