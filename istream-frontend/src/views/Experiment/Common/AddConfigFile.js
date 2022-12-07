import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { addNewConfig } from "src/api/ModulesAPI";
import { toast } from "react-toastify";

export default class AddConfigFile extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      configFileName: "",
      configFile: null,
   };

   onSubmit = (event) => {
      event.preventDefault();

      const newModuleConfigFileData = new FormData();
      newModuleConfigFileData.append("userId", this.state.user.userId);
      newModuleConfigFileData.append("username", this.state.user.username);
      newModuleConfigFileData.append("isUserModule", this.props.selectedModule.type === "Custom");
      newModuleConfigFileData.append("componentName", this.props.componentName);
      newModuleConfigFileData.append("moduleName", this.props.selectedModule.name);
      newModuleConfigFileData.append("configFileName", this.state.configFileName);
      newModuleConfigFileData.append("configFile", this.state.configFile);

      addNewConfig(newModuleConfigFileData).then((res) => {
         this.props.updateData(this.props.selectedModule);
         toast.success(res);
         this.setState({ configFileName: "" });
         this.props.toggleDisplay();
      });
   };

   render() {
      return (
         <div >
            <Modal dialogClassName="modal-size" show={this.props.display} className="blur">
               <Modal.Header>
                  <Modal.Title>Add New Module's Config File</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <div>
                     <h5>Add your config file:</h5>
                  </div>
                  <form onSubmit={this.onSubmit}>
                     <div className="form-group row">
                        <label className="col-6 col-form-label">Module's config file name</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="text"
                              value={this.state.configFileName}
                              onChange={(event) => {
                                 this.setState({ configFileName: event.target.value });
                              }}
                              required
                           />
                        </div>
                     </div>
                     <div className="form-group row mt-2">
                        <label className="col-6 col-form-label">Upload module's config file</label>
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
