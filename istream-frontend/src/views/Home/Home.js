import React, { Component } from "react";
import Header from "src/views/Common/Header";
import { Button, Modal } from "react-bootstrap";
import { createNewExperiment } from "src/api/ExperimentAPI";

export default class Home extends Component {
   state = {
      showCreateExperimentModal: false,
      experimentName: "",
      experimentDescription: "",
      networkComponentExistence: false,
      transcoderComponentExistence: false,
      user: JSON.parse(localStorage.getItem("user")),
   };

   createExperiment = (event) => {
      event.preventDefault();

      const newExperimentObj = {
         experimentId: Date.now().toString(),
         experimentName: this.state.experimentName,
         experimentDescription: this.state.experimentDescription,
         userId: this.state.user.userId,
         username: this.state.user.username,
         networkComponentExistence: this.state.networkComponentExistence,
         transcoderComponentExistence: this.state.transcoderComponentExistence,
      };

      createNewExperiment(newExperimentObj).then((res) => {
         console.log(res);
         // const isNew = 0; //0 means new experiment
         //redirect to the experiment configuration screen and pass the experiment id along
         // this.props.history.push(
         //    `/experimentconfig/${newExperimentObj.userName}/${newExperimentObj.experimentId}/${isNew}`
         // );
      });
   };

   generateCreateExperimentModal = () => {
      return (
         <div>
            <Modal show={this.state.showCreateExperimentModal}>
               <Modal.Header>
                  <Modal.Title>Experiment Setup</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <form onSubmit={this.createExperiment}>
                     <div className="form-group row">
                        <label className="col-6 col-form-label">Experiment Name</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="text"
                              value={this.state.experimentName}
                              onChange={(event) => {
                                 this.setState({ experimentName: event.target.value });
                              }}
                              required
                           />
                        </div>
                     </div>
                     <div className="form-group row mt-2">
                        <label className="col-6 col-form-label">Experiment Description</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="text"
                              value={this.state.experimentDescription}
                              onChange={(event) => {
                                 this.setState({ experimentDescription: event.target.value });
                              }}
                              required
                           />
                        </div>
                     </div>
                     <div className="mt-2">
                        Which of these components do you need in your experiment?
                     </div>
                     <div className="form-check">
                        <input
                           className="form-check-input"
                           type="checkbox"
                           onChange={() => {
                              this.setState({
                                 transcoderComponentExistence:
                                    !this.state.transcoderComponentExistence,
                              });
                           }}
                        />
                        <label className="form-check-label">Transcoder Module</label>
                     </div>
                     <div className="form-check">
                        <input
                           className="form-check-input"
                           type="checkbox"
                           onChange={() => {
                              this.setState({
                                 networkComponentExistence: !this.state.networkComponentExistence,
                              });
                           }}
                        />
                        <label className="form-check-label">Network Module</label>
                     </div>
                     <div className="mt-3">
                        <Button
                           type="submit"
                           className="me-2"
                           style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
                        >
                           Create
                        </Button>
                        <Button
                           onClick={() => {
                              this.setState({ showCreateExperimentModal: false });
                           }}
                           variant="danger"
                        >
                           Cancel
                        </Button>
                     </div>
                  </form>
               </Modal.Body>
            </Modal>
         </div>
      );
   };

   render() {
      return (
         <div>
            <Header />
            <div className="container">
               <div className="row justify-content-end mt-2">
                  <h2 className="col-md-10 ">My Experiments</h2>
                  <Button
                     className="col-md-2"
                     onClick={() => this.setState({ showCreateExperimentModal: true })}
                  >
                     Create New Experiment
                  </Button>
               </div>
               {this.generateCreateExperimentModal()}
            </div>
         </div>
      );
   }
}
