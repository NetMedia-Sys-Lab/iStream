import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Form from "@rjsf/core";

import InformationButton from "src/views/Common/InformationButton";

export default class DockerConfiguration extends Component {
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

   render() {
      return (
         <div>
            <div>
               <div>{this.dockerConfigForm()}</div>
            </div>
         </div>
      );
   }
}
