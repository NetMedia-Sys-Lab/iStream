import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { addNewConfig } from "src/api/ModulesAPI";
import { toast } from "react-toastify";

export default class AddConfig extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      configName: "",
      configFile: null,
   };

   onSubmit = (event) => {
      event.preventDefault();

      const newModuleConfigData = new FormData();
      newModuleConfigData.append("userId", this.state.user.userId);
      newModuleConfigData.append("username", this.state.user.username);
      newModuleConfigData.append("componentName", this.props.componentName);
      newModuleConfigData.append("moduleName", this.props.selectedModule);
      newModuleConfigData.append("configName", this.state.configName);
      newModuleConfigData.append("configFile", this.state.configFile);

      addNewConfig(newModuleConfigData).then((res) => {
         this.props.updateData(this.props.selectedModule);
         toast.success(res);
         this.setState({ configName: "" });
         this.props.toggleDisplay();
      });
   };

   render() {
      return (
         <div>
            <Modal dialogClassName="modal-size" show={this.props.display}>
               <Modal.Header>
                  <Modal.Title>Add New Module's Config</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <div><h5>Add your configuration file:</h5></div>
                  <form onSubmit={this.onSubmit}>
                     <div className="form-group row">
                        <label className="col-6 col-form-label">Module's Config File Name</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="text"
                              value={this.state.configName}
                              onChange={(event) => {
                                 this.setState({ configName: event.target.value });
                              }}
                              required
                           />
                        </div>
                     </div>
                     <div className="form-group">
                        <label className="col-6 col-form-label">Upload Module's Config File</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="file"
                              name="configFile"
                              onChange={(event) => {
                                 this.setState({ configFile: event.target.files[0] });
                              }}
                              required
                           />
                        </div>
                     </div>
                     <div className="mt-3">
                        <Button onClick={this.props.toggleDisplay} variant="danger">
                           Cancel
                        </Button>
                        <Button className="float-end" type="submit">
                           Upload
                        </Button>
                     </div>
                  </form>
               </Modal.Body>
            </Modal>
         </div>
      );
   }
}
