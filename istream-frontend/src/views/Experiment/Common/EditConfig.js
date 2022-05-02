import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { getConfigFileData, updateConfigFileData } from "src/api/ModulesAPI";
import { toast } from "react-toastify";

export default class EditConfig extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      textData: "",
   };

   constructor(props) {
      super(props);

      getConfigFileData(this.state.user, this.props.componentName, this.props.moduleName, this.props.configName).then((fileData) => {
         this.setState({
            textData: fileData,
         });
      });
   }

   handleModelDataChange = (e) => {
      this.setState({
         textData: e.target.value,
      });
   };

   onSubmit = (event) => {
      event.preventDefault();

      const data = {
         username: this.state.user.username,
         componentName: this.props.componentName,
         moduleName: this.props.moduleName,
         configName: this.props.configName,
         data: this.state.textData,
      };

      updateConfigFileData(data).then((res) => {
         toast.success(res);
         this.props.detached();
      });
   };

   render() {
      return (
         <div>
            <Modal dialogClassName="modal-size" show={this.props.display}>
               <Modal.Header>
                  <Modal.Title>Edit Config {this.props.configName}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  File Contents are:
                  <div>
                     <textarea
                        rows="15"
                        cols="50"
                        id="modalTextArea"
                        name="modalTextArea"
                        value={this.state.textData}
                        onChange={(e) => {
                           this.setState({
                              textData: e.target.value,
                           });
                        }}
                     ></textarea>
                  </div>
                  <hr />
                  <div className="mt-3">
                     <Button onClick={this.props.detached} variant="danger">
                        Cancel
                     </Button>
                     <Button className="float-end" type="submit" onClick={this.onSubmit}>
                        Save
                     </Button>
                  </div>
               </Modal.Body>
            </Modal>
         </div>
      );
   }
}
