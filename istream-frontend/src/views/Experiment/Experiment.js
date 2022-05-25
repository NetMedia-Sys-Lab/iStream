import React, { Component } from "react";
import Header from "src/views/Common/Header";
import VideoCard from "src/views/Experiment/VideoCard";
import NetworkCard from "src/views/Experiment/NetworkCard";
import ClientCard from "src/views/Experiment/ClientCard";
import ServerCard from "src/views/Experiment/ServerCard";
import TranscoderCard from "src/views/Experiment/TranscoderCard";
// import ExperimentSettingCard from "src/views/Experiment/ExperimentSettingCard";
import { getExperimentConfig, getExperimentData, subscribeToBuildExperiment, subscribeToRunExperiment } from "src/api/ExperimentAPI";
import { getVideosList } from "src/api/ModulesAPI";
import { useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
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
      displayRunState: false,
      buildOutput: "",
      runOutput: "",
      dependencyData: experimentJSONData,
      videosList: [],
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
                                 let videoData = this.state.videosList.find((element) => element.videoId === video);
                                 return (
                                    <div key={index}>
                                       {index + 1}. {videoData.name} - {videoData.resolution}
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
            <Modal dialogClassName="modal-size" show={this.state.displayBuildState}>
               <Modal.Header>
                  <Modal.Title>Build Phase</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <textarea rows="15" cols="60" id="modalTextArea" name="modalTextArea" defaultValue={this.state.buildOutput}></textarea>

                  <hr />
                  <div className="mt-3">
                     <Button className="float-end" onClick={() => this.setState({ displayBuildState: false, buildOutput: [] })}>
                        Done
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
            <Modal dialogClassName="modal-size" show={this.state.displayRunState}>
               <Modal.Header>
                  <Modal.Title>Run Phase</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <textarea rows="15" cols="60" id="modalTextArea" name="modalTextArea" defaultValue={this.state.runOutput}></textarea>

                  <hr />
                  <div className="mt-3">
                     <Button className="float-end" onClick={() => this.setState({ displayRunState: false, runOutput: [] })}>
                        Done
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
      this.setState({ displayBuildState: true });
      const data = {
         username: this.state.user.username,
         experimentId: this.state.experimentId,
      };
      subscribeToBuildExperiment(data, (err, output) => {
         output = output.filter((str) => str !== "");
         let out = "";
         output.forEach((element) => (out += element + "\n"));

         this.setState({ buildOutput: this.state.buildOutput + out });
      });
   };

   runExperiment = () => {
      this.setState({ displayRunState: true });
      const data = {
         username: this.state.user.username,
         experimentId: this.state.experimentId,
      };
      subscribeToRunExperiment(data, (err, output) => {
         console.log(output);
         output = output.filter((str) => str !== "");
         let out = "";
         output.forEach((element) => (out += element + "\n"));

         this.setState({ runOutput: this.state.runOutput + out });
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
                     <div className="col-sm">
                        <ServerCard experimentId={this.state.experimentId} />
                     </div>

                     {this.state.transcoderComponentExistence ? (
                        <div className="col-sm">
                           <TranscoderCard experimentId={this.state.experimentId} />
                        </div>
                     ) : (
                        ""
                     )}

                     {this.state.networkComponentExistence ? (
                        <div className="col-sm">
                           <NetworkCard experimentId={this.state.experimentId} />
                        </div>
                     ) : (
                        ""
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
                        <Button className="me-2" variant="primary" onClick={this.buildExperiment}>
                           Build
                        </Button>
                        <Button
                           className="me-2"
                           onClick={this.runExperiment}
                           style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
                        >
                           Run
                        </Button>
                        <Button variant="danger">Stop</Button>
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
