import React, { Component } from "react";
import { Button, Modal, Spinner, Form, Row, Col } from "react-bootstrap";

import { runExperiment, downloadExperimentResult } from "src/api/ExperimentAPI";
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

      const experimentInfo = {
         username: this.state.user.username,
         experimentId: this.props.experimentId,
         numberOfRepetition: this.props.numberOfRepetition,
         runningInXterm: this.props.runningInXterm,
      };

      runExperiment(
         experimentInfo,
         (err, serverOutput) => {
            if (serverOutput === "SOCKET_CLOSED") {
               this.setState({ serverRunSpinner: false });
               return;
            }
            this.setState({ serverRunSpinner: true });
            console.log(serverOutput);
            serverOutput = serverOutput.filter((str) => str !== "");
            let out = "";
            serverOutput.forEach((element) => (out += element + "\n"));

            this.setState({ serverRunOutput: this.state.serverRunOutput + out });
         },
         (err, clientOutput) => {
            if (clientOutput === "SOCKET_CLOSED") {
               this.setState({ clientRunSpinner: false });
               return;
            }
            this.setState({ clientRunSpinner: true });

            clientOutput = clientOutput.filter((str) => str !== "");
            let out = "";
            clientOutput.forEach((element) => (out += element + "\n"));

            this.setState({ clientRunOutput: this.state.clientRunOutput + out });
         },
         (err, networkOutput) => {
            if (networkOutput === "SOCKET_CLOSED") {
               this.setState({ networkRunSpinner: false });
               return;
            }
            this.setState({ networkRunSpinner: true });

            networkOutput = networkOutput.filter((str) => str !== "");
            let out = "";
            networkOutput.forEach((element) => (out += element + "\n"));

            this.setState({ networkRunOutput: this.state.networkRunOutput + out });
         }
      );
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
                  <div className="row mb-2">
                     <h4 style={{ display: "inline" }}>Running Configuration</h4>
                  </div>
                  <Form>
                     <Row className="align-items-center">
                        <Col sm={8}>
                           <Form.Group as={Row}>
                              <Form.Label column>Number of Repetition:</Form.Label>
                              <Col>
                                 <Form.Control
                                    type="number"
                                    value={this.props.numberOfRepetition}
                                    onChange={(event) => {
                                       this.props.updateState(event.target.value, "repetition");
                                    }}
                                    required
                                 />
                              </Col>
                           </Form.Group>
                        </Col>
                        {/* <Col sm={4}>
                           <Form.Check
                              type="switch"
                              defaultChecked={this.props.runningInXterm}
                              label="Running in xterm"
                              onChange={(event) => {
                                 this.props.updateState(event.target.checked, "xterm");
                              }}
                           />
                        </Col> */}
                     </Row>
                  </Form>

                  <hr />
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
                           style={{ width: "30vw", height: this.state.fullscreenRunModal ? "65vh" : "18vh" }}
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
                           style={{ width: "30vw", height: this.state.fullscreenRunModal ? "65vh" : "18vh" }}
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
                           style={{ width: "30vw", height: this.state.fullscreenRunModal ? "65vh" : "18vh" }}
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
