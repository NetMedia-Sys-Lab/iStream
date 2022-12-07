import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { Button, Modal, Spinner } from "react-bootstrap";

import { getExperimentConfig, getExperimentDependency, subscribeToRunExperiment } from "src/api/ExperimentAPI";
import Header from "src/views/Common/Header";
import ClientCard from "src/views/Experiment/ClientCard";
import NetworkCard from "src/views/Experiment/NetworkCard";
import VideoCard from "src/views/Experiment/VideoCard";
import ServerCard from "src/views/Experiment/ServerCard";
import TranscoderCard from "src/views/Experiment/TranscoderCard";
import { experimentDataModel } from "src/models/Experiment";

function withParams(Component) {
   return (props) => <Component {...props} params={useParams()} />;
}

class Experiment extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      experimentId: this.props.params.experimentId,
      experimentConfig: {
         networkComponentExistence: true,
         transcoderComponentExistence: true,
         repetition: 1,
      },
      displayBuildModal: false,
      fullscreenBuildModal: false,
      displayRunModal: false,
      fullscreenRunModal: false,
      buildOutput: [],
      buildSpinner: false,
      runOutput: [],
      runSpinner: false,
   };

   constructor(props) {
      super(props);

      getExperimentConfig(this.state.user, this.state.experimentId).then((res) => {
         this.setState({
            experimentConfig: {
               networkComponentExistence: res.networkComponentExistence,
               transcoderComponentExistence: res.transcoderComponentExistence,
               repetition: res.repetition,
            },
         });
      });
   }

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

   runExperiment = () => {
      this.setState({ runOutput: [] });
      const data = {
         username: this.state.user.username,
         experimentId: this.state.experimentId,
         numberOfRepetition: this.state.numberOfRepetition,
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
                           value={this.state.numberOfRepetition}
                           onChange={(event) => {
                              this.setState({ numberOfRepetition: event.target.value });
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
         <main>
            <div className="h-100 main-height">
               <Header />
               <div className="container">
                  <div className="row mt-4">
                     <h2>Config Experiment</h2>
                  </div>
                  <div className="row">
                     <div className="col-lg p-0">
                        <VideoCard experimentId={this.state.experimentId} />
                     </div>

                     <div className="col-lg p-0">
                        <NetworkCard experimentId={this.state.experimentId} componentName="Server" />
                     </div>

                     {this.state.experimentConfig.transcoderComponentExistence && (
                        <div className="col-lg p-0">
                           <NetworkCard experimentId={this.state.experimentId} componentName="Transcoder" />
                        </div>
                     )}

                     {this.state.experimentConfig.networkComponentExistence && (
                        <div className="col-lg p-0">
                           <NetworkCard experimentId={this.state.experimentId} componentName="Network" />{" "}
                        </div>
                     )}

                     <div className="col-lg p-0">
                        <NetworkCard experimentId={this.state.experimentId} componentName="Client" />{" "}
                     </div>
                  </div>
                  <div className="row space">
                     <div>
                        <Button className="me-2" variant="primary" onClick={() => this.setState({ displayBuildModal: true })}>
                           Build
                        </Button>
                        <Button className="me-2" onClick={() => this.setState({ displayRunModal: true })} variant="success">
                           Run
                        </Button>
                        {/* <Button variant="danger">Stop</Button> */}
                     </div>
                  </div>
               </div>
               {this.buildStateModal()}
               {this.runStateModal()}
            </div>
         </main>
      );
   }
}

export default withParams(Experiment);
