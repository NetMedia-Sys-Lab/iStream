import React, { Component } from "react";
import Header from "src/views/Common/Header";
import { Button } from "react-bootstrap";
import ExperimentsList from "./ExperimentsList";
import CreateExperimentModal from "./CreateExperimentModal";
import "./Home.css";

export default class Home extends Component {
   state = {
      displayCreateExperimentModal: false,
   };

   render() {
      return (
         <main>
            <div className="h-100 main-height">
               <Header />
               <div className="container">
                  <div className="row justify-content-end mt-4">
                     <h2 className="col-md-10">My Experiments</h2>
                     <Button className="col-md-2" onClick={() => this.setState({ displayCreateExperimentModal: true })}>
                        Create New Experiment
                     </Button>
                  </div>
                  <CreateExperimentModal
                     displayModal={this.state.displayCreateExperimentModal}
                     toggleDisplayModal={() => {
                        this.setState({
                           displayCreateExperimentModal: !this.state.displayCreateExperimentModal,
                        });
                     }}
                  />
                  <div className="row justify-content-center">
                     <div className="center-container">
                        <ExperimentsList />
                     </div>
                  </div>
               </div>
            </div>
         </main>
      );
   }
}
