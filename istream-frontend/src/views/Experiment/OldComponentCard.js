import React, { Component } from "react";

import Stepper from "src/views/Experiment/Common/Stepper";
import { getModules, getComponentDockerConfig } from "src/api/ComponentsAPI";
import { getModuleConfigsAndParameters, saveModuleData, getModuleData } from "src/api/ModulesAPI";
import ModuleSelection from "src/views/Experiment/Common/ModuleSelection";
import ModuleConfiguration from "src/views/Experiment/Common/ModuleConfiguration";
import DockerConfiguration from "src/views/Experiment/Common/DockerConfiguration";
import { toast } from "react-toastify";

export default class NetworkCard extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      totalNumberOfSteps: 3,
      componentName: this.props.componentName,
      displayStepperModal: false,
      showModuleConfiguration: false,
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
         advanceConfig: {
            names: [],
            selected: "",
         },
         simpleConfig: {
            parameters: {},
            values: {},
         },
      },
      dockerConfig: {
         parameters: {},
         values: {},
      },
   };

   constructor(props) {
      super(props);

      this.getComponentModules();

      getComponentDockerConfig(this.state.user, this.state.componentName, this.props.experimentId).then((data) => {
         this.setState({ dockerConfig: { parameters: data.parameters, values: data.values } });
      });

      this.fetchData();
   }

   getComponentModules = () => {
      getModules(this.state.user, this.state.componentName).then((res) => {
         let tempState = this.state.modules;
         tempState.names.iStream = res;
         this.setState({ modules: tempState });
      });
   };

   fetchData = () => {
      getModuleData(this.state.user, this.state.componentName, this.props.experimentId).then((data) => {
         console.log(data);
         if (data.name !== "") {
            getModuleConfigsAndParameters(this.state.user, this.state.componentName, data.name, data.type === "Custom" ? true : false).then(
               (res) => {
                  console.log(res);
                  this.setState({
                     selectedModule: {
                        type: data.type,
                        name: data.name,
                        customConfiguration: data.customConfig,
                        machineID: data.machineID,
                        advanceConfig: {
                           selected: data.configName,
                        },
                        simpleConfig: {
                           parameters: res.parameters,
                           values: data.defaultConfigParameters,
                        },
                     },
                     showModuleConfiguration: true,
                  });
               }
            );
         }
      });
   };

   getOneModuleInfo = () => {
      getModuleConfigsAndParameters(
         this.state.user,
         this.state.componentName,
         this.state.selectedModule.name,
         this.state.selectedModule.type === "Custom" ? true : false
      )
         .then((res) => {
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
         })
         .catch((e) => {
            toast.warn(e.data);
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

   onModuleConfigurationSubmit = (values) => {
      let data = {
         userId: this.state.user.userId,
         username: this.state.user.username,
         componentName: this.state.componentName,
         experimentId: this.props.experimentId,
         selectedModuleType: this.state.selectedModule.type,
         selectedModule: this.state.selectedModule.name,
         customConfig: this.state.selectedModule.customConfiguration,
      };
      if (this.state.selectedModule.customConfiguration) {
         data["selectedConfigFileName"] = this.state.selectedModule.selectedConfigFile;
      } else {
         data["defaultConfigParameters"] = values;
      }

      saveModuleData(data).then((res) => {
         this.fetchData();
         this.setState({ showModuleConfiguration: true, displayStepperModal: !this.state.displayStepperModal });
         toast.success(res);
      });
   };

   onDockerConfigurationChange = (values) => {
      console.log(values);
   };



   render() {
      return (
         <div className="row justify-content-center mx-1">
            <div className="center-container module-card" onClick={() => this.setState({ displayStepperModal: true })}>
               <h4 className="text-center">
                  <i className="fa fa-wifi module-icon"></i>
                  <br />
                  {this.state.componentName}
               </h4>
               {this.showModuleConfig()}
            </div>

            <Stepper
               display={this.state.displayStepperModal}
               totalNumberOfSteps={this.state.totalNumberOfSteps}
               steps={[
                  <ModuleSelection
                     modules={this.state.modules}
                     selectedModule={this.state.selectedModule}
                     updateSelectedModule={this.updateSelectedModule}
                     componentName={this.state.componentName}
                     updateData={this.getUserModuleData}
                  />,
                  <DockerConfiguration
                     componentName={this.state.componentName}
                     dockerConfig={this.state.dockerConfig}
                     onChangeConfig={this.onDockerConfigurationChange}
                  />,
                  <ModuleConfiguration
                     componentName={this.state.componentName}
                     selectedModule={this.state.selectedModule}
                     updateSelectedModule={this.updateSelectedModule}
                     getOneModuleInfo={this.getOneModuleInfo}
                     onSubmit={this.onModuleConfigurationSubmit}
                  />,
               ]}
               getOneModuleInfo={this.getOneModuleInfo}
               toggleDisplay={() => this.setState({ displayStepperModal: !this.state.displayStepperModal })}
               // updateSelectedModule={this.updateSelectedModule}
               // isUserModule={this.state.selectedModule.type === "Custom"}
               componentName={this.state.componentName}
               onSubmit={this.onModuleConfigurationSubmit}
               // updateData={this.fetchData}
               // updateConfigFiles={this.getOneModuleData}
               selectedModule={this.state.selectedModule}
               // experimentId={this.props.experimentId}
            />
         </div>
      );
   }
}
