import React, { Component } from "react";
import Header from "src/views/Common/Header";
import VideoCard from "src/views/Experiment/VideoCard";
import NetworkCard from "src/views/Experiment/NetworkCard";
import ClientCard from "src/views/Experiment/ClientCard";
import ServerCard from "src/views/Experiment/ServerCard";
import TranscoderCard from "src/views/Experiment/TranscoderCard";
import {
   getExperimentConfig,
   getExperimentData,
   subscribeToBuildExperiment,
   subscribeToRunExperiment,
   downloadExperimentResult,
} from "src/api/ExperimentAPI";
import b64ToBlob from "b64-to-blob";
import fileSaver from "file-saver";
import { getVideosList } from "src/api/ModulesAPI";
import { useParams } from "react-router-dom";
import { Button, Modal, Spinner } from "react-bootstrap";
import { experimentJSONData } from "src/models/Experiment";
import "./Experiment.css";

function withParams(Component) {
   return (props) => <Component {...props} params={useParams()} />;
}

class Experiment extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      experimentId: this.props.params.experimentId,
      networkComponentExistence: true,
      transcoderComponentExistence: true,
      displayConfig: false,
      displayBuildState: false,
      fullscreenBuildModal: false,
      displayRunState: false,
      fullscreenRunModal: false,
      buildOutput: [],
      buildSpinner: false,
      runOutput: [],
      runSpinner: false,
      dependencyData: experimentJSONData,
      videosList: [],
      numberOfRepetition: 1,
   };

   constructor(props) {
      super(props);
      getExperimentConfig(this.state.user, this.state.experimentId).then((res) => {
         this.setState({
            networkComponentExistence: res.networkComponentExistence,
            transcoderComponentExistence: res.transcoderComponentExistence,
         });
      });
      getVideosList(this.state.user).then((res) => {
         this.setState({ videosList: res });
      });
   }

   experimentInfoModal = () => {
      return (
         <div>
            <Modal show={this.state.displayConfig}>
               <Modal.Header>
                  <Modal.Title>Experiment Configuration</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <div>
                     <div>
                        <h6 className="text-info">Videos: </h6>
                        {this.state.dependencyData.Video.id.length <= 0 ? (
                           "No Video Selected"
                        ) : (
                           <ul>
                              {this.state.dependencyData.Video.id.map((video, index) => {
                                 let videoData = this.state.videosList.find((element) => element.id === video);
                                 return (
                                    <div key={index}>
                                       {index + 1}. {videoData.name}
                                    </div>
                                 );
                              })}
                           </ul>
                        )}
                     </div>
                     <div>
                        <h6 className="text-info">Server: </h6>
                        <span>
                           {this.state.dependencyData.Server.name} - {this.state.dependencyData.Server.config}
                        </span>
                     </div>
                     <div>
                        <h6 className="text-info">Transcoder: </h6>
                        <span>
                           {this.state.dependencyData.Transcoder.name} - {this.state.dependencyData.Transcoder.config}
                        </span>
                     </div>
                     <div>
                        <h6 className="text-info">Network: </h6>
                        <span>
                           {this.state.dependencyData.Network.name} - {this.state.dependencyData.Network.config}
                        </span>
                     </div>
                     <div>
                        <h6 className="text-info">Client: </h6>
                        <span>
                           {this.state.dependencyData.Client.name} - {this.state.dependencyData.Client.config}
                        </span>
                     </div>
                  </div>

                  <hr />
                  <div className="mt-3">
                     <Button className="float-end" onClick={() => this.setState({ displayConfig: false })}>
                        Done
                     </Button>
                  </div>
               </Modal.Body>
            </Modal>
         </div>
      );
   };

   buildStateModal = () => {
      return (
         <div>
            <Modal
               dialogClassName={this.state.fullscreenBuildModal ? "" : "modal-size"}
               show={this.state.displayBuildState}
               fullscreen={this.state.fullscreenBuildModal}
            >
               <Modal.Header>
                  <Button variant="danger" onClick={() => this.setState({ displayBuildState: false })}>
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
                        {this.state.buildSpinner ? (
                           <Spinner as="span" variant="light" size="sm" role="status" aria-hidden="true" animation="border" />
                        ) : (
                           ""
                        )}
                        Start
                     </Button>
                  </div>
               </Modal.Body>
            </Modal>
         </div>
      );
   };

   runStateModal = () => {
      return (
         <div>
            <Modal
               dialogClassName={this.state.fullscreenRunModal ? "" : "modal-size"}
               show={this.state.displayRunState}
               fullscreen={this.state.fullscreenRunModal}
            >
               <Modal.Header>
                  <Button variant="danger" onClick={() => this.setState({ displayRunState: false })}>
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
                        {this.state.runSpinner ? (
                           <Spinner as="span" variant="light" size="sm" role="status" aria-hidden="true" animation="border" />
                        ) : (
                           ""
                        )}
                        Start
                     </Button>
                  </div>
               </Modal.Body>
            </Modal>
         </div>
      );
   };

   getExperimentInfo = () => {
      getExperimentData(this.state.user, this.state.experimentId).then((res) => {
         this.setState({ dependencyData: res, displayConfig: true });
      });
   };

   buildExperiment = () => {
      this.setState({ buildOutput: [] });
      const data = {
         username: this.state.user.username,
         experimentId: this.state.experimentId,
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

   str2bytes = (str) => {
      console.log(str.length);
      var bytes = new Uint8Array(str.length);
      for (var i = 0; i < str.length; i++) {
         bytes[i] = str.charCodeAt(i);
      }
      return bytes;
   };

   downloadResults = () => {
      downloadExperimentResult(this.state.user.username, this.state.experimentId).then((response) => {
         const blob = b64ToBlob(response, "application/zip");
         fileSaver.saveAs(blob, `results.zip`);
      });
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
                  <div className="row row-cols-3">
                     <div className="col-sm">
                        <VideoCard experimentId={this.state.experimentId} />
                     </div>

                     {this.state.transcoderComponentExistence && (
                        <div className="col-sm">
                           <TranscoderCard experimentId={this.state.experimentId} />
                        </div>
                     )}

                     <div className="col-sm">
                        <ServerCard
                           transcoderComponentExistence={this.state.transcoderComponentExistence}
                           experimentId={this.state.experimentId}
                        />
                     </div>

                     {this.state.networkComponentExistence && (
                        <div className="col-sm">
                           <NetworkCard experimentId={this.state.experimentId} />
                        </div>
                     )}

                     <div className="col-sm">
                        <ClientCard experimentId={this.state.experimentId} />
                     </div>
                     {/* <div className="col-md-2">
                        <ExperimentSettingCard experimentId={this.state.experimentId} />
                     </div> */}
                  </div>
                  <div className="row space">
                     <div>
                        <Button className="me-2" onClick={this.getExperimentInfo} variant="info">
                           Information
                        </Button>
                        <Button className="me-2" variant="primary" onClick={() => this.setState({ displayBuildState: true })}>
                           Build
                        </Button>
                        <Button
                           className="me-2"
                           onClick={() => this.setState({ displayRunState: true })}
                           style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
                        >
                           Run
                        </Button>
                        {/* <Button variant="danger">Stop</Button> */}
                     </div>
                  </div>
               </div>
               {this.experimentInfoModal()}
               {this.buildStateModal()}
               {this.runStateModal()}
            </div>
         </main>
      );
   }
}

export default withParams(Experiment);
