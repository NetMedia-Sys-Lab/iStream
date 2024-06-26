import React, { Component } from "react";
import { useParams } from "react-router-dom";

import { getExperimentConfig } from "src/api/ExperimentAPI";
import Header from "src/views/Common/Header";
import ComponentCard from "src/views/Experiment/ComponentCard";
import VideoCard from "src/views/Experiment/VideoCard";
import BuildExperiment from "src/views/Experiment/Common/BuildExperiment";
import RunExperiment from "src/views/Experiment/Common/RunExperiment";
import Results from "src/views/Experiment/Common/Results";

import { toast } from "react-toastify";

function withParams(Component) {
   return (props) => <Component {...props} params={useParams()} />;
}

class Experiment extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      experimentId: this.props.params.experimentId,
      experimentConfig: {
         componentExistence: {
            video: false,
            server: false,
            transcoder: false,
            network: false,
            client: false,
         },
         repetition: 1,
         runningInXterm: false,
      },
   };

   constructor(props) {
      super(props);

      getExperimentConfig(this.state.user, this.state.experimentId)
         .then((res) => {
            this.setState({
               experimentConfig: {
                  componentExistence: res.componentExistence,
                  repetition: res.repetition,
                  runningInXterm: res.runningInXterm,
               },
            });
         })
         .catch((e) => {
            toast.warn(e.data);
         });
   }

   updateState = (value, type) => {
      if (type === "repetition") {
         let tempState = this.state.experimentConfig;
         tempState.repetition = value;
         this.setState({ experimentConfig: tempState });
      } else if (type === "xterm") {
         let tempState = this.state.experimentConfig;
         tempState.runningInXterm = value;
         this.setState({ experimentConfig: tempState });
      }
   };

   render() {
      return (
         <main>
            <div className="h-100 main-height">
               <Header />
               <div>
                  <div className="container">
                     <div className="row mt-4">
                        <h2>Config Experiment</h2>
                     </div>
                     <div className="row">
                        <div className="col-lg p-0">
                           <VideoCard experimentId={this.state.experimentId} />
                        </div>

                        {this.state.experimentConfig.componentExistence.server &&
                        this.state.experimentConfig.componentExistence.transcoder ? (
                           <div className="col-lg p-0">
                              <ComponentCard experimentId={this.state.experimentId} componentName="Server" />
                           </div>
                        ) : (
                           ""
                        )}

                        {this.state.experimentConfig.componentExistence.server &&
                        !this.state.experimentConfig.componentExistence.transcoder ? (
                           <div className="col-lg p-0">
                              <ComponentCard experimentId={this.state.experimentId} componentName="Server" />
                           </div>
                        ) : (
                           ""
                        )}

                        {this.state.experimentConfig.componentExistence.network ? (
                           <div className="col-lg p-0">
                              <ComponentCard experimentId={this.state.experimentId} componentName="Network" />
                           </div>
                        ) : (
                           ""
                        )}

                        {this.state.experimentConfig.componentExistence.client ? (
                           <div className="col-lg p-0">
                              <ComponentCard experimentId={this.state.experimentId} componentName="Client" />
                           </div>
                        ) : (
                           ""
                        )}
                     </div>
                  </div>
                  <div className="container">
                     <div>
                        <BuildExperiment
                           experimentId={this.state.experimentId}
                           componentExistence={this.state.experimentConfig.componentExistence}
                        />
                        <RunExperiment
                           experimentId={this.state.experimentId}
                           componentExistence={this.state.experimentConfig.componentExistence}
                           numberOfRepetition={this.state.experimentConfig.repetition}
                           runningInXterm={this.state.experimentConfig.runningInXterm}
                           updateState={this.updateState}
                        />
                        <Results experimentId={this.state.experimentId} />
                     </div>
                  </div>
               </div>
            </div>
         </main>
      );
   }
}

export default withParams(Experiment);
