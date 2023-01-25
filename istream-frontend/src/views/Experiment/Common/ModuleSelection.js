import React, { Component } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

import AddModule from "src/views/Experiment/Common/AddModule";

export default class ModuleSelection extends Component {
   state = {
      displayAddModule: false,
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
         if (this.props.selectedModule.id === module.id) {
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
      const renderTooltip = (props) => (
         <Tooltip id="button-tooltip" {...props}>
            Add New Module
         </Tooltip>
      );
      return (
         <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
            <Button
               variant="secondary"
               className="float-end ms-1"
               onClick={() => {
                  this.setState({ displayAddModule: true });
               }}
            >
               +
            </Button>
         </OverlayTrigger>
      );
   }

   render() {
      return (
         <div>
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
