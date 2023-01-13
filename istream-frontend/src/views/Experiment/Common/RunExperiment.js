import React, { Component } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";

import {
   subscribeServerOfExperiment,
   subscribeClientOfExperiment,
   subscribeNetworkOfExperiment,
   downloadExperimentResult,
} from "src/api/ExperimentAPI";
import b64ToBlob from "b64-to-blob";
import fileSaver from "file-saver";

export default class RunExperiment extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      displayRunModal: false,
      fullscreenRunModal: false,
      serverRunOutput: [],
      clientRunOutput: [],
      networkRunOutput: [],
      clientRunSpinner: false,
      networkRunSpinner: false,
      serverRunSpinner: false,
   };

   runExperiment = () => {
      this.setState({ serverRunOutput: [], clientRunOutput: [], networkRunOutput: [] });

      const data = {
         username: this.state.user.username,
         experimentId: this.props.experimentId,
         numberOfRepetition: this.props.numberOfRepetition,
      };

      subscribeServerOfExperiment(data, (err, output) => {
         if (output === "SOCKET_CLOSED") {
            this.setState({ serverRunSpinner: false });
            return;
         }
         this.setState({ serverRunSpinner: true });

         output = output.filter((str) => str !== "");
         let out = "";
         output.forEach((element) => (out += element + "\n"));

         this.setState({ serverRunOutput: this.state.serverRunOutput + out });
      });

      subscribeClientOfExperiment(data, (err, output) => {
         if (output === "SOCKET_CLOSED") {
            this.setState({ clientRunSpinner: false });
            return;
         }
         this.setState({ clientRunSpinner: true });

         output = output.filter((str) => str !== "");
         let out = "";
         output.forEach((element) => (out += element + "\n"));

         this.setState({ clientRunOutput: this.state.clientRunOutput + out });
      });

      subscribeNetworkOfExperiment(data, (err, output) => {
         if (output === "SOCKET_CLOSED") {
            this.setState({ networkRunSpinner: false });
            return;
         }
         this.setState({ networkRunSpinner: true });

         output = output.filter((str) => str !== "");
         let out = "";
         output.forEach((element) => (out += element + "\n"));

         this.setState({ networkRunOutput: this.state.networkRunOutput + out });
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
                  <div className="row">
                     <div className="col">
                        <label>
                           <b>Server</b>
                           {this.state.serverRunSpinner ? (
                              <Spinner as="span" size="sm" role="status" aria-hidden="true" animation="border" />
                           ) : (
                              ""
                           )}
                        </label>
                        <br />
                        <textarea
                           label="Server"
                           style={{ width: "30vw", height: this.state.fullscreenRunModal ? "70vh" : "18vh" }}
                           id="modalTextArea"
                           name="modalTextArea"
                           // className="me-2"
                           value={this.state.serverRunOutput}
                        />
                     </div>

                     <div className="col">
                        <label>
                           <b>Network</b>
                           {this.state.networkRunSpinner ? (
                              <Spinner as="span" size="sm" role="status" aria-hidden="true" animation="border" />
                           ) : (
                              ""
                           )}
                        </label>
                        <br />
                        <textarea
                           label="Client"
                           style={{ width: "30vw", height: this.state.fullscreenRunModal ? "70vh" : "18vh" }}
                           id="modalTextArea"
                           name="modalTextArea"
                           value={this.state.networkRunOutput}
                        />
                     </div>

                     <div className="col">
                        <label>
                           <b>Client</b>
                           {this.state.clientRunSpinner ? (
                              <Spinner as="span" size="sm" role="status" aria-hidden="true" animation="border" />
                           ) : (
                              ""
                           )}
                        </label>
                        <br />
                        <textarea
                           label="Client"
                           style={{ width: "30vw", height: this.state.fullscreenRunModal ? "70vh" : "18vh" }}
                           id="modalTextArea"
                           name="modalTextArea"
                           value={this.state.clientRunOutput}
                        />
                     </div>
                  </div>

                  <hr />
                  <div className="mt-3">
                     <Button onClick={this.downloadResults}>Download Results</Button>
                     <Button variant="success" className="float-end" onClick={this.runExperiment}>
                        Start
                     </Button>
                  </div>
               </Modal.Body>
            </Modal>
         </div>
      );
   };

   downloadResults = () => {
      downloadExperimentResult(this.state.user.username, this.props.experimentId).then((response) => {
         const blob = b64ToBlob(response, "application/zip");
         fileSaver.saveAs(blob, `results.zip`);
      });
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
