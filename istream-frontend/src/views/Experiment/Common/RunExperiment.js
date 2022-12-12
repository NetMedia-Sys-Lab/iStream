import React, { Component } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";

import { subscribeToRunExperiment } from "src/api/ExperimentAPI";

export default class RunExperiment extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      displayRunModal: false,
      fullscreenRunModal: false,
      runOutput: [],
      runSpinner: false,
   };

   runExperiment = () => {
      this.setState({ runOutput: [] });

      const data = {
         username: this.state.user.username,
         experimentId: this.props.experimentId,
         numberOfRepetition: this.props.numberOfRepetition,
      };
      subscribeToRunExperiment(data, (err, output) => {
         if (output === "SOCKET_CLOSED") {
            this.setState({ runSpinner: false });
            return;
         }
         this.setState({ runSpinner: true });

         output = output.filter((str) => str !== "");
         let out = "";
         output.forEach((element) => (out += element + "\n"));

         this.setState({ runOutput: this.state.runOutput + out });
      });
   };

   runStateModal = () => {
      return (
         <div>
            <Modal
               dialogClassName={this.state.fullscreenRunModal ? "" : "modal-size"}
               show={this.state.displayRunModal}
               fullscreen={this.state.fullscreenRunModal}
            >
               <Modal.Header>
                  <Button variant="danger" onClick={() => this.setState({ displayRunModal: false })}>
                     <i className="fa fa-window-close" aria-hidden="true"></i>
                  </Button>
                  <Modal.Title>Run Phase</Modal.Title>
                  <Button
                     variant="secondary"
                     onClick={() => {
                        this.setState({ fullscreenRunModal: !this.state.fullscreenRunModal });
                     }}
                  >
                     {this.state.fullscreenRunModal ? (
                        <i className="fa fa-compress" aria-hidden="true"></i>
                     ) : (
                        <i className="fa fa-expand" aria-hidden="true"></i>
                     )}
                  </Button>
               </Modal.Header>
               <Modal.Body>
                  <div className="form-group row mb-2">
                     <label className="col-4 col-form-label">Number of Repetition:</label>
                     <div className="col-2">
                        <input
                           className="form-control"
                           type="number"
                           value={this.props.numberOfRepetition}
                           onChange={(event) => {
                              this.props.updateState(event.target.value);
                           }}
                           required
                        />
                     </div>
                  </div>
                  <textarea
                     style={{ width: "100%", height: this.state.fullscreenRunModal ? "85%" : "45vh" }}
                     id="modalTextArea"
                     name="modalTextArea"
                     value={this.state.runOutput}
                  />

                  <hr />
                  <div className="mt-3">
                     <Button onClick={this.downloadResults}>Download Results</Button>
                     <Button variant="success" className="float-end" onClick={this.runExperiment}>
                        Start
                        {this.state.runSpinner ? (
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

   render() {
      return (
         <div>
            <Button className="float-start me-2" variant="success" onClick={() => this.setState({ displayRunModal: true })}>
               Run
            </Button>
            {this.runStateModal()}
         </div>
      );
   }
}
