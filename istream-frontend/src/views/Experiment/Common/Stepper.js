import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";

import ProgressBar from "src/views/Common/ProgressBar";

export default class Stepper extends Component {
   state = {
      currentStep: 1,
      displayAddModule: false,
      displayAddNewVideo: false,
      displayMachineConfig: false,
      showSubmitButton: false,
   };

   goToNextStep = () => {
      let currentStep = this.state.currentStep;
      this.setState({
         currentStep: currentStep >= this.props.totalNumberOfSteps - 1 ? this.props.totalNumberOfSteps : currentStep + 1,
      });
   };

   goToPreviousStep = () => {
      let currentStep = this.state.currentStep;
      this.setState({
         currentStep: currentStep <= 1 ? 1 : currentStep - 1,
      });
   };

   get nextButton() {
      if (this.state.currentStep < this.props.totalNumberOfSteps && this.props.selectedModule.name !== "") {
         return (
            <Button
               className="float-end me-1"
               onClick={() => {
                  this.props.getOneModuleInfo();
                  this.goToNextStep();
               }}
            >
               Next
            </Button>
         );
      }
      return null;
   }

   get previousButton() {
      if (this.state.currentStep !== 1) {
         return (
            <Button
               variant="secondary"
               className="ms-1"
               onClick={() => {
                  this.goToPreviousStep();
               }}
            >
               Previous
            </Button>
         );
      }
      return null;
   }

   get cancelButton() {
      return (
         <Button
            onClick={this.props.toggleDisplay}
            // className="float-start"
            variant="danger"
         >
            Cancel
         </Button>
      );
   }

   get submitButton() {
      if (this.state.currentStep === this.props.totalNumberOfSteps || this.state.showSubmitButton === true) {
         return (
            <Button
               className="float-end"
               onClick={() => {
                  this.props.onSubmit();
                  this.props.toggleDisplay();
                  this.setState({ currentStep: 1 });
               }}
            >
               Submit
            </Button>
         );
      }
      return null;
   }

   render() {
      return (
         <div>
            <Modal dialogClassName="modal-size" show={this.props.display}>
               <Modal.Header>
                  <Modal.Title>{this.props.componentName} Module Configuration</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <ProgressBar value={this.state.currentStep} numberOfSteps={this.props.totalNumberOfSteps + 1} />
                  <br />
                  <div>
                     {this.props.steps.map((step, index) => {
                        if (index + 1 === this.state.currentStep) return <div key={index}>{step}</div>;
                        return <div key={index}></div>;
                     })}
                  </div>

                  <div className="mt-3">
                     {this.cancelButton}
                     {this.previousButton}
                     {this.nextButton}
                     {this.submitButton}

                     {this.props.componentName === "Video" ? this.props.addNewVideoButton : ""}

                     {/* {this.addNewVideoButton}
                        {this.sshButton}  */}
                  </div>
               </Modal.Body>
            </Modal>
         </div>
      );
   }
}
