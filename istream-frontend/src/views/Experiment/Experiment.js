import React, { Component } from "react";
import Header from "src/views/Common/Header";
import VideoCard from "src/views/Experiment/VideoCard";
import NetworkCard from "src/views/Experiment/NetworkCard";
import ClientCard from "src/views/Experiment/ClientCard";
import ServerCard from "src/views/Experiment/ServerCard";
import TranscoderCard from "src/views/Experiment/TranscoderCard";
import ExperimentSettingCard from "src/views/Experiment/ExperimentSettingCard";


import { useParams } from "react-router-dom";
import "./Experiment.css";

function withParams(Component) {
   return (props) => <Component {...props} params={useParams()} />;
}

class Experiment extends Component {
   state = {
      experimentId: this.props.params.experimentId,
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
                     <div className="col-md-3">
                        <VideoCard experimentId={this.state.experimentId} />
                     </div>
                     <div className="col-md-3">
                        <ServerCard experimentId={this.state.experimentId} />
                     </div>
                     <div className="col-md-3">
                        <TranscoderCard experimentId={this.state.experimentId} />
                     </div>
                     <div className="col-md-3">
                        <NetworkCard experimentId={this.state.experimentId} />
                     </div>
                     <div className="col-md-3">
                        <ClientCard experimentId={this.state.experimentId} />
                     </div>
                     <div className="col-md-3">
                        <ExperimentSettingCard experimentId={this.state.experimentId} />
                     </div>
                  </div>
               </div>
            </div>
         </main>
      );
   }
}

export default withParams(Experiment);
