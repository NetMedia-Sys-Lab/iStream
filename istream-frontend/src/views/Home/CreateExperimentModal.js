import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { createNewExperiment } from "src/api/HomeAPI";
import { toast } from "react-toastify";

export default class CreateExperimentModal extends Component {
   state = {
      experimentName: "",
      experimentDescription: "",
      componentExistence: {
         video: true,
         server: true,
         transcoder: false,
         network: false,
         client: true,
      },
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
         componentExistence: {
            video: this.state.componentExistence.video,
            server: this.state.componentExistence.server,
            transcoder: this.state.componentExistence.transcoder,
            network: this.state.componentExistence.network,
            client: this.state.componentExistence.client,
         },
      };

      createNewExperiment(newExperimentObj).then((res) => {
         toast.success(res);
         window.location.assign(`/experiment/${newExperimentObj.experimentId}`);
      });
   };

   changeComponentExistenceState = (component, value) => {
      let tempState = this.state.componentExistence;
      // if (component === "transcoder" && value === true) {
      //    tempState.server = true;
      // } else if (component === "server" && value === false) {
      //    tempState.transcoder = false;
      // }

      tempState[component] = !this.state.componentExistence[component];
      this.setState({ componentExistence: tempState });
   };

   render() {
      return (
         <div>
            <Modal show={this.props.displayModal}>
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
                     <div className="mt-2">Which of these components do you need in your experiment?</div>
                     <div className="form-check">
                        <label className="form-check-label">Video Source</label>
                        <input
                           className="form-check-input"
                           type="checkbox"
                           // onChange={() => this.changeComponentExistenceState("video")}
                           checked={this.state.componentExistence.video}
                        />
                     </div>
                     <div className="form-check">
                        <label className="form-check-label">Server Module</label>
                        <input
                           className="form-check-input"
                           type="checkbox"
                           // onChange={(e) => this.changeComponentExistenceState("server", e.target.checked)}
                           checked={this.state.componentExistence.server}
                        />
                     </div>
                     <div className="form-check  ms-5">
                        <label className="form-check-label">Transcoder Module</label>
                        <input
                           className="form-check-input"
                           type="checkbox"
                           onChange={(e) => {
                              this.changeComponentExistenceState("transcoder", e.target.checked);
                           }}
                           checked={this.state.componentExistence.transcoder}
                        />
                     </div>
                     <div className="form-check">
                        <label className="form-check-label">Network Module</label>
                        <input
                           className="form-check-input"
                           type="checkbox"
                           onChange={() => this.changeComponentExistenceState("network")}
                           checked={this.state.componentExistence.network}
                        />
                     </div>
                     <div className="form-check">
                        <label className="form-check-label">Client Module</label>
                        <input
                           className="form-check-input"
                           type="checkbox"
                           onChange={() => this.changeComponentExistenceState("client")}
                           checked={this.state.componentExistence.client}
                        />
                     </div>
                     <div className="mt-3">
                        <Button type="submit" className="float-end me-2" style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}>
                           Create
                        </Button>
                        <Button onClick={this.props.toggleDisplayModal} variant="danger">
                           Cancel
                        </Button>
                     </div>
                  </form>
               </Modal.Body>
            </Modal>
         </div>
      );
   }
}
