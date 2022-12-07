import React, { Component } from "react";
import { Dropdown, DropdownButton, Button } from "react-bootstrap";

import AddModule from "src/views/Experiment/Common/AddModule";

export default class ModuleSelection extends Component {
   state = {
      displayAddModule: false,
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
                     this.props.updateSelectedModule("name", item);
                  }}
                  checked={this.props.selectedModule.name === item}
               />
               <label className="form-check-label">{item}</label>
            </div>
         );
      });
   };

   moduleSelection = () => {
      const moduleTypeOptions = (
         <DropdownButton
            id="dropdown-basic-button"
            title={this.props.selectedModule.type === "" ? "Select Module Type" : this.props.selectedModule.type}
            variant="secondary"
         >
            {this.props.modules.types.map((moduleType) => (
               <Dropdown.Item key={moduleType}>
                  <div
                     onClick={() => {
                        this.props.updateSelectedModule("type", moduleType);
                     }}
                  >
                     {moduleType}
                  </div>
               </Dropdown.Item>
            ))}
         </DropdownButton>
      );
      const iStreamModuleOptions = this.radioButtonOptions(this.props.modules.names.iStream);
      const userModuleOptions =
         this.props.modules.names.custom.length === 0 ? (
            <div>No Modules found. Please add a module to proceed.</div>
         ) : (
            this.radioButtonOptions(this.props.modules.names.custom)
         );

      return (
         <div className="row mb-2">
            <div className="col-6">
               <h5>Select Module Type</h5>
               <div>{moduleTypeOptions}</div>
            </div>
            <div className="col-6">
               <div>{this.props.selectedModule.type !== "" ? <h5>Select Module</h5> : ""}</div>
               <div>
                  {this.props.selectedModule.type !== ""
                     ? this.props.selectedModule.type === "iStream"
                        ? iStreamModuleOptions
                        : userModuleOptions
                     : ""}
               </div>
            </div>
         </div>
      );
   };

   get addModuleButton() {
      if (this.props.selectedModule.type === "Custom") {
         return (
            <div className="mt-3">
               <Button
                  variant="secondary"
                  className="float-end ms-1"
                  onClick={() => {
                     this.setState({ displayAddModule: true });
                  }}
               >
                  Add New Module
               </Button>
            </div>
         );
      }
      return null;
   }

   render() {
      return (
         <div>
            {this.moduleSelection()}
            {this.addModuleButton}
            <AddModule
               display={this.state.displayAddModule}
               componentName={this.props.componentName}
               toggleDisplay={() => {
                  this.setState({ displayAddModule: !this.state.displayAddModule });
               }}
               updateData={this.props.updateData}
            />
         </div>
      );
   }
}
