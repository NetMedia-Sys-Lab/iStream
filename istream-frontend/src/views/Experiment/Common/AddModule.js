import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { addNewModule } from "src/api/ComponentsAPI";
import { toast } from "react-toastify";

export default class AddModule extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      moduleName: "",
      moduleDescription: "",
      moduleFile: null, //This will be a zip file(single Zip file)
   };

   onSubmit = (event) => {
      event.preventDefault();

      const newModuleData = new FormData();
      newModuleData.append("userId", this.state.user.userId);
      newModuleData.append("username", this.state.user.username);
      newModuleData.append("componentName", this.props.componentName);
      newModuleData.append("moduleName", this.state.moduleName);
      newModuleData.append("moduleDescription", this.state.moduleDescription);
      newModuleData.append("moduleFile", this.state.moduleFile);

      addNewModule(newModuleData)
         .then((res) => {
            this.props.updateData();
            toast.success(res);
            this.setState({ moduleName: "", moduleDescription: "" });
            this.props.toggleDisplay();
         })
         .catch((e) => {
            toast.warn(e.data);
         });
   };

   render() {
      return (
         <div>
            <Modal dialogClassName="modal-size" show={this.props.display} className="blur">
               <Modal.Header>
                  <Modal.Title>Add New {this.props.componentName} Module</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <div>
                     <h5>Add your module's zip file:</h5>
                  </div>
                  <form onSubmit={this.onSubmit}>
                     <div className="form-group row">
                        <label className="col-6 col-form-label">Module Name</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="text"
                              value={this.state.moduleName}
                              onChange={(event) => {
                                 this.setState({ moduleName: event.target.value });
                              }}
                              required
                           />
                        </div>
                     </div>
                     <div className="form-group row mt-2">
                        <label className="col-6 col-form-label">Module Description</label>
                        <div className="col-6">
                           <textarea
                              className="form-control"
                              type="text"
                              value={this.state.moduleDescription}
                              onChange={(event) => {
                                 this.setState({ moduleDescription: event.target.value });
                              }}
                           />
                        </div>
                     </div>
                     <div className="form-group row mt-2">
                        <label className="col-6 col-form-label">Upload Module Files</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="file"
                              name="moduleFile"
                              onChange={(event) => {
                                 this.setState({ moduleFile: event.target.files[0] });
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
