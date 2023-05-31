import React, { Component } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";

import { buildExperiment } from "src/api/ExperimentAPI";

export default class BuildExperiment extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      displayBuildModal: false,
      fullscreenBuildModal: false,
      serverRunOutput: [],
      clientRunOutput: [],
      networkRunOutput: [],
      clientRunSpinner: false,
      networkRunSpinner: false,
      serverRunSpinner: false,
   };

   buildExperiment = () => {
      this.setState({ serverRunOutput: [], clientRunOutput: [], networkRunOutput: [] });

      const experimentInfo = {
         username: this.state.user.username,
         experimentId: this.props.experimentId,
      };

      buildExperiment(
         experimentInfo,
         (err, serverOutput) => {
            if (serverOutput === "SOCKET_CLOSED") {
               this.setState({ serverRunSpinner: false });
               return;
            }
            this.setState({ serverRunSpinner: true });
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

   buildStateModal = () => {
      let textAreaSize = "30vw";
      if (!this.props.componentExistence.network && this.props.componentExistence.client) textAreaSize = "45vw";
      else if (this.props.componentExistence.network && !this.props.componentExistence.client) textAreaSize = "45vw";
      else if (!this.props.componentExistence.network && !this.props.componentExistence.client) textAreaSize = "90vw";

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
                           style={{
                              width: this.state.fullscreenBuildModal ? textAreaSize : "30vw",
                              height: this.state.fullscreenBuildModal ? "75vh" : "18vh",
                           }}
                           id="modalTextArea"
                           name="modalTextArea"
                           value={this.state.serverRunOutput}
                        />
                     </div>

                     {this.props.componentExistence.network ? (
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
                              style={{
                                 width: this.state.fullscreenBuildModal ? textAreaSize : "30vw",
                                 height: this.state.fullscreenBuildModal ? "75vh" : "18vh",
                              }}
                              id="modalTextArea"
                              name="modalTextArea"
                              value={this.state.networkRunOutput}
                           />
                        </div>
                     ) : (
                        ""
                     )}

                     {this.props.componentExistence.client ? (
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
                              style={{
                                 width: this.state.fullscreenBuildModal ? textAreaSize : "30vw",
                                 height: this.state.fullscreenBuildModal ? "75vh" : "18vh",
                              }}
                              id="modalTextArea"
                              name="modalTextArea"
                              value={this.state.clientRunOutput}
                           />
                        </div>
                     ) : (
                        ""
                     )}
                  </div>
                  <hr />
                  <div className="mt-3">
                     <Button
                        variant="success"
                        className="float-end"
                        onClick={this.buildExperiment}
                        disabled={this.state.serverRunSpinner || this.state.clientRunSpinner || this.state.networkRunSpinner}
                     >
                        Start
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
            <Button className="float-start me-2" variant="primary" onClick={() => this.setState({ displayBuildModal: true })}>
               Build
            </Button>
            {this.buildStateModal()}
         </div>
      );
   }
}
