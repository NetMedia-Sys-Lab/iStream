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
               schema={this.props.selectedModule.configParameters["parameters"]}
               FieldTemplate={this.customFieldTemplate}
               uiSchema={this.props.selectedModule.parametersUISchema}
               formData={this.props.selectedModule.configParametersValues}
               onSubmit={(values) => this.props.onSubmit(values.formData)}
            >
               {/* <div className="mt-3">
                  <Button type="submit" className="float-end">
                     Submit
                  </Button>
               </div> */}
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
                  checked={this.props.selectedModule.selectedConfigFile === item}
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

   customConfig = () => {
      const configFiles =
         this.props.selectedModule.customConfigFiles.length === 0 ? (
            <div>No Config files found. Please add a new config file to proceed.</div>
         ) : (
            this.radioButtonOptions(this.props.selectedModule.customConfigFiles)
         );
      return (
         <div>
            <h5>Manual Config</h5>
            <div>{configFiles}</div>
            <div className="mt-3">
               {/* <Button onClick={() => this.props.onSubmit()} className="float-end">
                  Submit
               </Button> */}
            </div>
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
                     this.props.updateSelectedModule("customConfiguration", false);
                  }}
                  checked={!this.props.selectedModule.customConfiguration}
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
                     this.props.updateSelectedModule("customConfiguration", true);
                  }}
                  checked={this.props.selectedModule.customConfiguration}
               />
               <label className="form-check-label">Custom Config</label>
            </div>
            <hr />
         </div>
      );
   };

   createConfigSelectionForm = () => {
      let configurationForm;
      if (Object.keys(this.props.selectedModule.configParameters).length === 0) {
         configurationForm = <div>{this.customConfig()}</div>;
      } else if (
         this.props.selectedModule.configParameters["customConfig"] === true &&
         this.props.selectedModule.configParameters["defaultConfig"] === true
      ) {
         configurationForm = (
            <div>
               {this.configTypeSelection()}
               {this.props.selectedModule.customConfiguration ? this.customConfig() : this.defaultConfig()}
            </div>
         );
      } else if (
         this.props.selectedModule.configParameters["customConfig"] === true &&
         this.props.selectedModule.configParameters["defaultConfig"] === false
      ) {
         configurationForm = <div>{this.customConfig()}</div>;
      } else if (
         this.props.selectedModule.configParameters["customConfig"] === false &&
         this.props.selectedModule.configParameters["defaultConfig"] === true
      ) {
         configurationForm = <div>{this.defaultConfig()}</div>;
      }
      return configurationForm;
   };

   get addModuleConfigButton() {
      if (Object.keys(this.props.selectedModule.configParameters).length === 0 || this.props.selectedModule.customConfiguration) {
         return (
            <Button
               variant="secondary"
               // className="float-end me-1"
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

            {this.addModuleConfigButton}
         </div>
      );
   }
}
