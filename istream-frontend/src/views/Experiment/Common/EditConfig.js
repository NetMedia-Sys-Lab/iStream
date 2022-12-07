import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { getConfigFileData, updateConfigFileData } from "src/api/ModulesAPI";
import { toast } from "react-toastify";

export default class EditConfig extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      textData: "",
      fullscreen: false,
   };

   constructor(props) {
      super(props);

      getConfigFileData(
         this.state.user,
         this.props.componentName,
         this.props.moduleName,
         this.props.configName,
         this.props.isUserModule
      ).then((fileData) => {
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
         isUserModule: this.props.isUserModule,
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
            <Modal
               show={this.props.display}
               dialogClassName={this.state.fullscreen ? "" : "modal-size"}
               fullscreen={this.state.fullscreen}
               className="blur"
            >
               <Modal.Header>
                  <Modal.Title>Edit Config {this.props.configName}</Modal.Title>
                  <Button
                     variant="secondary"
                     onClick={() => {
                        this.setState({ fullscreen: !this.state.fullscreen });
                     }}
                  >
                     {this.state.fullscreen ? (
                        <i className="fa fa-compress" aria-hidden="true"></i>
                     ) : (
                        <i className="fa fa-expand" aria-hidden="true"></i>
                     )}
                  </Button>
               </Modal.Header>
               <Modal.Body>
                  File Contents are:
                  <div>
                     <textarea
                        style={{ width: "100%", height: this.state.fullscreen ? "75vh" : "45vh" }}
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
