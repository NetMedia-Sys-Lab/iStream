import React, { Component } from "react";

import Stepper from "src/views/Experiment/Common/Stepper";
import { getDefaultModules, getUserModules, getModuleConfigsAndParameters } from "src/api/ModulesAPI";
import ModuleSelection from "src/views/Experiment/Common/ModuleSelection";
import ModuleConfiguration from "src/views/Experiment/Common/ModuleConfiguration";

export default class ServerCard extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      totalNumberOfSteps: 2,
      componentName: "Server",
      displayStepperModal: false,
      stateUpdated: false,
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
         customConfiguration: false,
         machineID: "",
         selectedConfigFile: "",
         customConfigFiles: [],
         configParameters: {},
      },
   };

   constructor(props) {
      super(props);
      this.fetchData();
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
   };

   static getDerivedStateFromProps(props, state) {
      if (props.data["type"] !== "" && state.stateUpdated === false) {
         return {
            selectedModule: {
               type: props.data["type"],
               name: props.data["name"],
               customConfiguration: props.data["customConfig"],
               machineID: props.data["machineID"],
               selectedConfigFile: props.data["config"],
               customConfigFiles: [],
               configParameters: {},
            },
            stateUpdated: true,
         };
      }
      return null;
   }

   getOneModuleInfo = () => {
      getModuleConfigsAndParameters(
         this.state.user,
         this.state.componentName,
         this.state.selectedModule.name,
         this.state.selectedModule.type === "Custom" ? true : false
      ).then((res) => {
         res.allConfigs.unshift("No Config");
         let tempState = this.state.selectedModule;
         tempState.customConfigFiles = res.allConfigs;
         tempState.configParameters = res.parameters;
         if (
            Object.keys(res.parameters).length === 0 ||
            (res.parameters["customConfig"] === true && res.parameters["defaultConfig"] === false)
         ) {
            tempState.customConfiguration = true;
         } else if (res.parameters["customConfig"] === false && res.parameters["defaultConfig"] === true) {
            tempState.customConfiguration = false;
         }
         this.setState({ selectedModule: tempState });
      });
   };

   updateSelectedModule = (mode, updatedState) => {
      if (mode === "type") {
         let tempState = this.state.selectedModule;
         tempState.type = updatedState;
         this.setState({ selectedModule: tempState });
      } else if (mode === "name") {
         let tempState = this.state.selectedModule;
         tempState.name = updatedState;
         this.setState({ selectedModule: tempState });
      } else if (mode === "customConfiguration") {
         let tempState = this.state.selectedModule;
         tempState.customConfiguration = updatedState;
         this.setState({ selectedModule: tempState });
      } else if (mode === "selectedConfigFile") {
         let tempState = this.state.selectedModule;
         tempState.selectedConfigFile = updatedState;
         this.setState({ selectedModule: tempState });
      }
   };

   onSubmit = (values) => {
      console.log("here in submit config");
      console.log(this.state.selectedModule.customConfiguration);
      console.log(values);
   };

   render() {
      return (
         <div className="row justify-content-center mx-1">
            <div className="center-container module-card" onClick={() => this.setState({ displayStepperModal: true })}>
               <h4 className="text-center">
                  <i className="fa fa-server module-icon"></i>
                  <br />
                  {this.state.componentName}
               </h4>
               {/* {this.showModuleConfig()} */}
            </div>

            <Stepper
               display={this.state.displayStepperModal}
               totalNumberOfSteps={this.state.totalNumberOfSteps}
               // validNextStep={this.state.selectedModule.name !== "" ? true : false}
               steps={[
                  <ModuleSelection
                     modules={this.state.modules}
                     selectedModule={this.state.selectedModule}
                     updateSelectedModule={this.updateSelectedModule}
                     componentName={this.state.componentName}
                     updateData={this.fetchData}
                  />,
                  <ModuleConfiguration
                     componentName={this.state.componentName}
                     selectedModule={this.state.selectedModule}
                     updateSelectedModule={this.updateSelectedModule}
                     getOneModuleInfo={this.getOneModuleInfo}
                     toggleDisplay={() => {
                        // this.setState({ displayStepperModal: !this.state.displayStepperModal });
                     }}
                     onSubmit={this.onSubmit}
                  />,
               ]}
               getOneModuleInfo={this.getOneModuleInfo}
               toggleDisplay={() => this.setState({ displayStepperModal: !this.state.displayStepperModal })}
               // updateSelectedModule={this.updateSelectedModule}
               // isUserModule={this.state.selectedModule.type === "Custom"}
               componentName={this.state.componentName}
               // updateData={this.fetchData}
               // updateConfigFiles={this.getOneModuleData}
               selectedModule={this.state.selectedModule}
               // experimentId={this.props.experimentId}
            />
         </div>
      );
   }
}
