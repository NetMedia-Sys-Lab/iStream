import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import ProgressBar from "src/views/Common/ProgressBar";
import AddModule from "src/views/Common/AddModule";

export default class Stepper extends Component {
   state = {
      currentStep: 1,
      displayAddModule: false,
   };

   goToNextStep = () => {
      let currentStep = this.state.currentStep;
      this.setState({
         currentStep:
            currentStep >= this.props.totalNumberOfSteps - 1
               ? this.props.totalNumberOfSteps
               : currentStep + 1,
      });
   };

   goToPreviousStep = () => {
      let currentStep = this.state.currentStep;
      this.setState({
         currentStep: currentStep <= 1 ? 1 : currentStep - 1,
      });
   };

   get nextButton() {
      if (this.state.currentStep < this.props.totalNumberOfSteps && this.props.validNextStep) {
         return (
            <Button className="float-end" onClick={this.goToNextStep}>
               Next
            </Button>
         );
      }
      return null;
   }

   get previousButton() {
      if (this.state.currentStep !== 1) {
         return (
            <Button variant="secondary" className="ms-1" onClick={this.goToPreviousStep}>
               Previous
            </Button>
         );
      }
      return null;
   }

   get submitButton() {
      if (this.state.currentStep === this.props.totalNumberOfSteps) {
         return (
            <Button
               className="float-end"
               onClick={() => {
                  this.props.onSubmit();
                  this.props.toggleDisplay();
               }}
            >
               Submit
            </Button>
         );
      }
      return null;
   }

   get cancelButton() {
      return (
         <Button onClick={this.props.toggleDisplay} variant="danger">
            Cancel
         </Button>
      );
   }

   get addModuleButton() {
      if (this.props.isUserModule && this.state.currentStep === 1) {
         return (
            <Button
               variant="success"
               className="float-end me-1"
               onClick={() => {
                  this.props.toggleDisplay();
                  this.setState({ displayAddModule: true });
               }}
            >
               Add Module
            </Button>
         );
      }
      return null;
   }

   render() {
      return (
         <div>
            <Modal show={this.props.display}>
               <Modal.Header>
                  <Modal.Title>Network Module Configuration</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <form>
                     <ProgressBar
                        value={this.state.currentStep}
                        numberOfSteps={this.props.totalNumberOfSteps + 1}
                     />
                     <br />
                     {this.props.steps.map((step, index) => {
                        if (index + 1 === this.state.currentStep)
                           return <div key={index}>{step}</div>;
                        return <div key={index}></div>;
                     })}

                     <div className="mt-3">
                        {this.cancelButton}
                        {this.previousButton}
                        {this.nextButton}
                        {this.submitButton}
                        {this.addModuleButton}
                     </div>
                  </form>
               </Modal.Body>
            </Modal>
            <AddModule
               display={this.state.displayAddModule}
               moduleType={this.props.moduleType}
               toggleDisplay={() => {
                  this.props.toggleDisplay();
                  this.setState({ displayAddModule: false });
               }}
               updateData={this.props.updateData}
            />
         </div>
      );
   }
}
