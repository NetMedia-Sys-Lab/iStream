import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Form from "@rjsf/core";

import EditConfig from "src/views/Experiment/Common/EditConfig";
import AddConfigFile from "src/views/Experiment/Common/AddConfigFile";
import InformationButton from "src/views/Common/InformationButton";

export default class ModuleConfiguration extends Component {
   state = {
      displayEditConfigModal: false,
      displayAddModuleConfigFile: false,
      selectedEditFile: "",
   };

   constructor(props) {
      super(props);

      this.props.getOneModuleInfo();
   }

   customFieldTemplate = (props) => {
      const { id, classNames, label, help, required, description, errors, children } = props;
      if (id === "root")
         return (
            <div className={classNames}>
               {description}
               {children}
               {errors}
               {help}
            </div>
         );
      return (
         <div className={classNames + " row mt-1"}>
            <div className="col-6 center">
               <label htmlFor={id} className="float-start">
                  {label + ":"}
                  {required ? "*" : null}
               </label>
               {description["props"]["description"] !== undefined ? (
                  <div className="float-start">
                     <InformationButton message={description["props"]["description"]} />
                  </div>
               ) : (
                  ""
               )}
            </div>
            <div className="col-6">{children}</div>
            {errors}
            {help}
         </div>
      );
   };

   defaultConfig = () => {
      return (
         <div>
            <Form
               schema={this.props.selectedModule.simpleConfig.parameters}
               FieldTemplate={this.customFieldTemplate}
               uiSchema={this.props.selectedModule.simpleConfig.uiSchema}
               formData={this.props.selectedModule.simpleConfig.values}
               onChange={(values) => this.props.onSimpleConfigurationChange(values.formData)}
            >
               <Button style={{ display: "none" }} type="submit" />
            </Form>
         </div>
      );
   };

   radioButtonOptions = (list) => {
      return list.map((item) => {
         return (
            <div className="form-check" key={item}>
               <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  onChange={() => {
                     this.props.updateSelectedModule("selectedConfigFile", item);
                  }}
                  checked={this.props.selectedModule.advanceConfig.selected === item}
               />
               <label className="form-check-label">{item}</label>
               {item !== "No Config" ? (
                  <button
                     type="button"
                     className="btn btn-link p-0 m-0 center"
                     onClick={() => this.setState({ selectedEditFile: item, displayEditConfigModal: true })}
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

   advanceConfig = () => {
      const configFiles =
         this.props.selectedModule.advanceConfig.names.length === 0 ? (
            <div>No Config files found. Please add a new config file to proceed.</div>
         ) : (
            this.radioButtonOptions(this.props.selectedModule.advanceConfig.names)
         );
      return (
         <div>
            <div>
               <h5 style={{ display: "inline" }}>Advance Configuration File</h5>
               {this.addModuleConfigButton}
               
            </div>
            <br />

            <div>{configFiles}</div>
         </div>
      );
   };

   configTypeSelection = () => {
      return (
         <div>
            <div className="form-check">
               <input
                  className="form-check-input"
                  type="radio"
                  name="DefaultConfig"
                  id="DefaultConfig"
                  onChange={() => {
                     this.props.updateSelectedModule("advanceConfiguration", false);
                  }}
                  checked={!this.props.selectedModule.advanceConfiguration}
               />
               <label className="form-check-label">Default Config</label>
            </div>
            <div className="form-check">
               <input
                  className="form-check-input"
                  type="radio"
                  name="advanceConfig"
                  id="advanceConfig"
                  onChange={() => {
                     this.props.updateSelectedModule("advanceConfiguration", true);
                  }}
                  checked={this.props.selectedModule.advanceConfiguration}
               />
               <label className="form-check-label">Advance Config</label>
            </div>
            <hr />
         </div>
      );
   };

   createConfigSelectionForm = () => {
      let configurationForm;
      if (Object.keys(this.props.selectedModule.simpleConfig.parameters).length === 0) {
         configurationForm = <div>{this.advanceConfig()}</div>;
      } else {
         configurationForm = (
            <div>
               {this.configTypeSelection()}
               {this.props.selectedModule.advanceConfiguration ? this.advanceConfig() : this.defaultConfig()}
            </div>
         );
      }

      return configurationForm;
   };

   get addModuleConfigButton() {
      if (this.props.selectedModule.advanceConfiguration) {
         return (
            <Button
               variant="secondary"
               className="float-end me-1"
               onClick={() => {
                  this.setState({ displayAddModuleConfigFile: true });
               }}
            >
               Add New Config
            </Button>
         );
      }
      return null;
   }

   render() {
      return (
         <div>
            <div>
               <h4>Module Configuration</h4>
               {this.createConfigSelectionForm()}
            </div>

            {this.state.displayEditConfigModal ? (
               <EditConfig
                  display={this.state.displayEditConfigModal}
                  configName={this.state.selectedEditFile}
                  moduleName={this.props.selectedModule.name}
                  componentName={this.props.componentName}
                  isUserModule={this.props.selectedModule.type === "Custom" ? true : false}
                  detached={() => this.setState({ displayEditConfigModal: false, displayStepperModal: true })}
               />
            ) : (
               ""
            )}

            <AddConfigFile
               display={this.state.displayAddModuleConfigFile}
               componentName={this.props.componentName}
               toggleDisplay={() => this.setState({ displayAddModuleConfigFile: false })}
               updateData={this.props.getOneModuleInfo}
               selectedModule={this.props.selectedModule}
            />
         </div>
      );
   }
}
