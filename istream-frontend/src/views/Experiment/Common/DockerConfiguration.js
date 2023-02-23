import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Form from "@rjsf/core";

import InformationButton from "src/views/Common/InformationButton";
import MachineConfig from "src/views/Experiment/Common/MachineConfig";

export default class DockerConfiguration extends Component {
   state = {
      displayMachineConfig: false,
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

   dockerConfigForm = () => {
      return (
         <div>
            <div>
               <Form
                  schema={this.props.dockerConfig.parameters}
                  FieldTemplate={this.customFieldTemplate}
                  formData={this.props.dockerConfig.newValues}
                  onChange={(values) => {
                     this.props.onChangeConfig(values.formData);
                  }}
               >
                  <div className="mt-3 ms-2">
                     <Button style={{ display: "none" }} type="submit" />
                  </div>
               </Form>
            </div>
         </div>
      );
   };

   get selectMachineButton() {
      return (
         <Button
            variant="secondary"
            className="float-end me-1"
            onClick={() => {
               this.setState({ displayMachineConfig: true });
            }}
         >
            Select Machine
         </Button>
      );
   }

   render() {
      return (
         <div>
            {this.props.selectedModule.name === "DASH.js" ? (
               <div>
                  <h6 style={{ display: "inline" }}>No Docker Configuration for this component</h6>
               </div>
            ) : (
               <div>
                  <div>
                     <h4 style={{ display: "inline" }}>Docker Configuration</h4>

                     {this.selectMachineButton}
                     <br />
                     <br />

                     <div>{this.dockerConfigForm()}</div>
                  </div>
                  <div>
                     <MachineConfig
                        display={this.state.displayMachineConfig}
                        toggleDisplay={() => {
                           this.setState({ displayMachineConfig: !this.state.displayMachineConfig });
                        }}
                        componentName={this.props.componentName}
                        experimentId={this.props.experimentId}
                        updateData={this.props.updateData}
                     />
                  </div>{" "}
               </div>
            )}
         </div>
      );
   }
}
