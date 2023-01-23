import React, { Component } from "react";

import { getModules, getComponentData, getDockerConfig, saveComponentData } from "src/api/ComponentsAPI";
import { getModuleConfigsAndParameters } from "src/api/ModulesAPI";

import { ModuleInfo } from "src/models/Module";
import { ComponentsIcons } from "src/models/UserInterface";

import ShowComponentConfig from "src/views/Experiment/Common/ShowComponentConfig";
import Stepper from "src/views/Experiment/Common/Stepper";
import ModuleSelection from "src/views/Experiment/Common/ModuleSelection";
import ModuleConfiguration from "src/views/Experiment/Common/ModuleConfiguration";
import DockerConfiguration from "src/views/Experiment/Common/DockerConfiguration";

import { toast } from "react-toastify";
import cloneDeep from "lodash/cloneDeep";

export default class ComponentCard extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      totalNumberOfSteps: 3,
      componentName: this.props.componentName,
      displayStepperModal: false,
      showComponentConfiguration: false,
      modules: {
         types: ["iStream", "Custom"],
         data: {
            iStream: [],
            custom: [],
         },
      },
      selectedModule: ModuleInfo,
      savedModule: ModuleInfo,
      dockerConfig: {
         parameters: {},
         savedValues: {},
         newValues: {},
      },
   };

   constructor(props) {
      super(props);

      this.getComponentModules();
      this.fetchData();
   }

   fetchData = () => {
      getComponentData(this.state.user, this.props.experimentId, this.state.componentName).then((data) => {
         if (data.name !== "") {
            this.setState({
               selectedModule: cloneDeep(data),
               savedModule: cloneDeep(data),
               showComponentConfiguration: true,
            });
         }
      });

      getDockerConfig(this.state.user, this.state.componentName, this.props.experimentId).then((data) => {
         this.setState({ dockerConfig: { parameters: data.parameters, savedValues: data.values, newValues: data.values } });
      });
   };

   getComponentModules = () => {
      getModules(this.state.user, this.state.componentName).then((res) => {
         let tempState = this.state.modules;
         tempState.data.iStream = res["iStream"];
         tempState.data.custom = res["user"];
         this.setState({ modules: tempState });
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
            tempState.advanceConfig.names = res.allConfigs;
            tempState.simpleConfig.parameters = res.parameters;
            tempState.advanceConfigurationExist = res.advanceConfigurationExist;
            tempState.simpleConfig.uiSchema = res.parametersUISchema;
            tempState.simpleConfig.values = {};
            if (Object.keys(res.parameters).length === 0) {
               tempState.advanceConfiguration = true;
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
      } else if (mode === "id") {
         let tempState = this.state.selectedModule;
         tempState.id = updatedState;
         this.setState({ selectedModule: tempState });
      } else if (mode === "advanceConfiguration") {
         let tempState = this.state.selectedModule;
         tempState.advanceConfiguration = updatedState;
         this.setState({ selectedModule: tempState });
      } else if (mode === "selectedConfigFile") {
         let tempState = this.state.selectedModule;
         tempState.advanceConfig.selected = updatedState;
         this.setState({ selectedModule: tempState });
      }
   };

   onDockerConfigurationChange = (values) => {
      let tempState = this.state.dockerConfig;
      tempState.newValues = values;
      this.setState({ dockerConfig: tempState });
   };

   onModuleSimpleConfigurationChange = (values) => {
      // console.log(this.state.selectedModule.simpleConfig.parameters);
      console.log(values);

      // let data = {};
      // Object.keys(this.state.selectedModule.simpleConfig.parameters["properties"]).map((item) => (data[item] = values[item]));
      let tempState = this.state.selectedModule;
      tempState.simpleConfig.values = values;
      this.setState({ selectedModule: tempState });
   };

   onSubmit = () => {
      let data = {
         userId: this.state.user.userId,
         username: this.state.user.username,
         componentName: this.state.componentName,
         experimentId: this.props.experimentId,
         selectedModuleData: this.state.selectedModule,
         dockerConfig: this.state.dockerConfig,
      };

      saveComponentData(data).then((res) => {
         this.fetchData();
         this.setState({ showModuleConfiguration: true });
         toast.success(res);
      });
   };

   render() {
      return (
         <div className="row justify-content-center mx-1">
            <div className="center-container module-card" onClick={() => this.setState({ displayStepperModal: true })}>
               <h4 className="text-center">
                  <i className={`component-icon ${ComponentsIcons[this.state.componentName]}`}></i>
                  <br />
                  {this.state.componentName}
               </h4>
               <ShowComponentConfig
                  show={this.state.showComponentConfiguration}
                  moduleData={this.state.savedModule}
                  dockerConfig={this.state.dockerConfig.savedValues}
               />
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
                     updateData={this.getComponentModules}
                  />,
                  <DockerConfiguration
                     componentName={this.state.componentName}
                     dockerConfig={this.state.dockerConfig}
                     onChangeConfig={this.onDockerConfigurationChange}
                     experimentId={this.props.experimentId}
                     updateData={this.fetchData}
                  />,
                  <ModuleConfiguration
                     componentName={this.state.componentName}
                     selectedModule={this.state.selectedModule}
                     updateSelectedModule={this.updateSelectedModule}
                     getOneModuleInfo={this.getOneModuleInfo}
                     onSimpleConfigurationChange={this.onModuleSimpleConfigurationChange}
                  />,
               ]}
               toggleDisplay={() => this.setState({ displayStepperModal: !this.state.displayStepperModal })}
               componentName={this.state.componentName}
               onSubmit={this.onSubmit}
               selectedModule={this.state.selectedModule}
            />
         </div>
      );
   }
}
