import React, { Component } from "react";
import Stepper from "src/views/Experiment/Common/Stepper";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { getDefaultModules, getUserModules, getConfigFiles, getModuleData, saveExperimentModuleData } from "src/api/ModulesAPI";
import { toast } from "react-toastify";

export default class ExperimentSettingCard extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      componentName: "Experiment Settings",
      displayModal: false,
      totalNumberOfSteps: 2,
      moduleTypes: ["iStream", "Custom"],
      iStreamModuleOptions: [],
      userModuleOptions: [],
      userModuleConfigFiles: ["No Config"],
      selectedModuleType: "",
      selectedModule: "",
      selectedConfigFile: "",
      showModuleConfiguration: false,
   };

   componentDidMount() {
      this.fetchData();

      getModuleData(this.state.user, this.state.componentName, this.props.experimentId).then((data) => {
         this.setState({
            selectedModuleType: data.type,
            selectedModule: data.name,
            selectedConfigFile: data.config,
            showModuleConfiguration: data.name !== "" ? true : false,
         });
      });
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
                           showModuleConfiguration: false,
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
         <div className="row">
            <div className="col-6">
               <h5>Select Module Type</h5>
               <div className="mb-3">{moduleTypeOptions}</div>
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

   configUserModule = () => {
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

      return (
         <div>
            <hr />
            <strong> Module Type: </strong>
            {this.state.selectedModuleType}
            <br />
            <strong> Module Selected: </strong>
            {this.state.selectedModule}
            <br />
            {this.state.selectedConfigFile !== "" ? (
               <div>
                  <strong>Config File Name: </strong>
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
                  <i className="fa fa-cog" style={{ color: "#244D5B" }}></i>
                  <br />
                  {this.state.componentName}
               </h4>
               {this.showModuleConfig()}
            </div>
            <Stepper
               display={this.state.displayModal}
               totalNumberOfSteps={this.state.totalNumberOfSteps}
               validNextStep={this.state.selectedModule !== "" ? true : false}
               steps={[this.moduleType(), [this.configUserModule()]]}
               onSubmit={this.onSubmit}
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
