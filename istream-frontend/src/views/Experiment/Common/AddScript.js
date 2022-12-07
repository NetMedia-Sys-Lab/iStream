import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { addNewScript } from "src/api/ModulesAPI";
import { toast } from "react-toastify";

export default class AddScript extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      scriptName: "",
      scriptFile: null,
   };

   onSubmit = (event) => {
      event.preventDefault();

      const newModuleScriptData = new FormData();
      newModuleScriptData.append("userId", this.state.user.userId);
      newModuleScriptData.append("username", this.state.user.username);
      newModuleScriptData.append("isUserModule", this.props.isUserModule);
      newModuleScriptData.append("componentName", this.props.componentName);
      newModuleScriptData.append("moduleName", this.props.selectedModule);
      newModuleScriptData.append("scriptName", this.state.scriptName);
      newModuleScriptData.append("scriptFile", this.state.scriptFile);

      addNewScript(newModuleScriptData).then((res) => {
         this.props.updateData(this.props.selectedModule);
         toast.success(res);
         this.setState({ scriptName: "" });
         this.props.toggleDisplay();
      });
   };

   render() {
      return (
         <div>
            <Modal dialogClassName="modal-size" show={this.props.display}>
               <Modal.Header>
                  <Modal.Title>Add New Module's Script</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <div>
                     <h5>Add your script file:</h5>
                  </div>
                  <form onSubmit={this.onSubmit}>
                     <div className="form-group row">
                        <label className="col-6 col-form-label">Module's script file name</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="text"
                              value={this.state.scriptName}
                              onChange={(event) => {
                                 this.setState({ scriptName: event.target.value });
                              }}
                              required
                           />
                        </div>
                     </div>
                     <div className="form-group row mt-2">
                        <label className="col-6 col-form-label">Upload module's script file</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="file"
                              name="scriptFile"
                              onChange={(event) => {
                                 this.setState({ scriptFile: event.target.files[0] });
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
