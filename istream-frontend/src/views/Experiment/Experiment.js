import React, { Component } from "react";
import { useParams } from "react-router-dom";

import { getExperimentConfig } from "src/api/ExperimentAPI";
import Header from "src/views/Common/Header";
import ComponentCard from "src/views/Experiment/ComponentCard";
import VideoCard from "src/views/Experiment/VideoCard";
import BuildExperiment from "src/views/Experiment/Common/BuildExperiment";
import RunExperiment from "src/views/Experiment/Common/RunExperiment";

import { toast } from "react-toastify";

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
   };

   constructor(props) {
      super(props);

      getExperimentConfig(this.state.user, this.state.experimentId)
         .then((res) => {
            this.setState(
               {
                  experimentConfig: {
                     networkComponentExistence: res.networkComponentExistence,
                     transcoderComponentExistence: res.transcoderComponentExistence,
                     repetition: res.repetition,
                  },
               },
               () => console.log(this.state.experimentConfig)
            );
         })
         .catch((e) => {
            toast.warn(e.data);
         });
   }

   updateState = (value) => {
      let tempState = this.state.experimentConfig;
      tempState.repetition = value;
      this.setState({ experimentConfig: tempState });
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
                        <ComponentCard experimentId={this.state.experimentId} componentName="Server" />
                     </div>

                     <div className="col-lg p-0">
                        <ComponentCard experimentId={this.state.experimentId} componentName="Network" />
                     </div>

                     <div className="col-lg p-0">
                        <ComponentCard experimentId={this.state.experimentId} componentName="Client" />
                     </div>
                  </div>
                  <div className="row space">
                     <div>
                        <BuildExperiment experimentId={this.state.experimentId} />
                        <RunExperiment
                           experimentId={this.state.experimentId}
                           numberOfRepetition={this.state.experimentConfig.repetition}
                           updateState={this.updateState}
                        />

                        {/* <Button variant="danger">Stop</Button> */}
                     </div>
                  </div>
               </div>
            </div>
         </main>
      );
   }
}

export default withParams(Experiment);
