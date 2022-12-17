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

   oldModuleSelection = () => {
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

   onModuleClick = (moduleIndex) => {
      this.setState({ selectedModuleID: moduleIndex });
   };

   moduleSelection = () => {
      let allModules = [
         ...this.props.modules.data.iStream.map((module) => {
            module.type = "iStream";
            return module;
         }),
         ...this.props.modules.data.custom.map((module) => {
            module.type = "Custom";
            return module;
         }),
      ];

      let modulesRow = allModules.map((module) => {
         let isSelected = false;
         if ((this.props.selectedModule.id === module.id)) {
            isSelected = true;
         }

         return (
            <tr
               key={module.name}
               onClick={() => {
                  this.onModuleClick(allModules.findIndex((element) => element.name === module.name));
                  this.props.updateSelectedModule("type", module.type);
                  this.props.updateSelectedModule("name", module.name);
                  this.props.updateSelectedModule("id", module.id);
               }}
               className={isSelected ? "selectedRow" : ""}
               style={{ cursor: "pointer" }}
            >
               <td>{module.name}</td>
               <td>{module.description}</td>
               <td>{module.type}</td>
            </tr>
         );
      });

      return (
         <div>
            <div>
               <h4 style={{ display: "inline" }}>Modules</h4>

               {this.addModuleButton}
            </div>
            <table className="table table-hover p-5">
               <thead className="thead-dark">
                  <tr>
                     <th scope="col">Name</th>
                     <th scope="col">Description</th>
                     <th scope="col">Type</th>
                  </tr>
               </thead>
               <tbody>{modulesRow}</tbody>
            </table>
         </div>
      );
   };

   get addModuleButton() {
      return (
         <Button
            variant="secondary"
            className="float-end ms-1"
            onClick={() => {
               this.setState({ displayAddModule: true });
            }}
         >
            +
         </Button>
      );
   }

   render() {
      return (
         <div>
            {/* {this.oldModuleSelection()} */}
            {this.moduleSelection()}
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
