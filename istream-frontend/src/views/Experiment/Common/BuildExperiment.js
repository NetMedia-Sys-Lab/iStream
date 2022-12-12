import React, { Component } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";

import { subscribeToBuildExperiment } from "src/api/ExperimentAPI";

export default class BuildExperiment extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      displayBuildModal: false,
      fullscreenBuildModal: false,
      buildOutput: [],
      buildSpinner: false,
   };

   buildStateModal = () => {
      return (
         <div>
            <Modal
               dialogClassName={this.state.fullscreenBuildModal ? "" : "modal-size"}
               show={this.state.displayBuildModal}
               fullscreen={this.state.fullscreenBuildModal}
            >
               <Modal.Header>
                  <Button variant="danger" onClick={() => this.setState({ displayBuildModal: false })}>
                     <i className="fa fa-window-close" aria-hidden="true"></i>
                  </Button>
                  <Modal.Title>Build Phase</Modal.Title>
                  <Button
                     variant="secondary"
                     onClick={() => {
                        this.setState({ fullscreenBuildModal: !this.state.fullscreenBuildModal });
                     }}
                  >
                     {this.state.fullscreenBuildModal ? (
                        <i className="fa fa-compress" aria-hidden="true"></i>
                     ) : (
                        <i className="fa fa-expand" aria-hidden="true"></i>
                     )}
                  </Button>
               </Modal.Header>
               <Modal.Body>
                  <textarea
                     style={{ width: "100%", height: this.state.fullscreenBuildModal ? "90%" : "45vh" }}
                     id="modalTextArea"
                     name="modalTextArea"
                     value={this.state.buildOutput}
                  />

                  <hr />
                  <div className="mt-3">
                     <Button variant="success" className="float-end" onClick={this.buildExperiment}>
                        Start
                        {this.state.buildSpinner ? (
                           <Spinner as="span" variant="light" size="sm" role="status" aria-hidden="true" animation="border" />
                        ) : (
                           ""
                        )}
                     </Button>
                  </div>
               </Modal.Body>
            </Modal>
         </div>
      );
   };

   buildExperiment = () => {
      this.setState({ buildOutput: [] });
      const data = {
         username: this.state.user.username,
         experimentId: this.props.experimentId,
      };
      subscribeToBuildExperiment(data, (err, output) => {
         if (output === "SOCKET_CLOSED") {
            this.setState({ buildSpinner: false });
            return;
         }
         this.setState({ buildSpinner: true });

         output = output.filter((str) => str !== "");
         let out = "";
         output.forEach((element) => (out += element + "\n"));

         this.setState({ buildOutput: this.state.buildOutput + out });
      });
   };

   render() {
      return (
         <div>
            <Button className="float-start me-2" variant="primary" onClick={() => this.setState({ displayBuildModal: true })}>
               Build
            </Button>
            {this.buildStateModal()}
         </div>
      );
   }
}
