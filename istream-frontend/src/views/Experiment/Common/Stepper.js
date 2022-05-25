import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import ProgressBar from "src/views/Common/ProgressBar";
import AddModule from "src/views/Experiment/Common/AddModule";
import AddConfig from "src/views/Experiment/Common/AddConfig";
import AddVideo from "src/views/Experiment/Common/AddVideo";
import MachineConfig from "src/views/Experiment/Common/MachineConfig";

export default class Stepper extends Component {
   state = {
      currentStep: 1,
      displayAddModule: false,
      displayAddModuleConfig: false,
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
      if (this.props.selectedModule === "dash.js" && this.state.currentStep === 1 && !this.state.showSubmitButton) {
         this.setState({ showSubmitButton: true });
      }
      if (this.props.selectedModule !== "dash.js" && this.state.showSubmitButton) {
         this.setState({ showSubmitButton: false });
      }

      if (this.state.currentStep < this.props.totalNumberOfSteps && this.props.validNextStep && !this.state.showSubmitButton) {
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
               variant="secondary"
               className="float-end me-1"
               onClick={() => {
                  this.props.toggleDisplay();
                  this.setState({ displayAddModule: true });
               }}
            >
               Add New Module
            </Button>
         );
      }
      return null;
   }

   get addModuleConfigButton() {
      if (this.state.currentStep === 2) {
         return (
            <Button
               variant="secondary"
               className="float-end me-1"
               onClick={() => {
                  this.props.toggleDisplay();
                  this.setState({ displayAddModuleConfig: true });
               }}
            >
               Add New Config
            </Button>
         );
      }
      return null;
   }

   get addNewVideoButton() {
      if (this.props.componentName === "Video" && this.state.currentStep === 1) {
         return (
            <Button
               variant="secondary"
               className="float-end me-1"
               onClick={() => {
                  this.props.toggleDisplay();
                  this.setState({ displayAddNewVideo: true });
               }}
            >
               Add New
            </Button>
         );
      }
      return null;
   }

   get sshButton() {
      if (this.state.currentStep === 1) {
         return (
            <Button
               variant="secondary"
               className="float-end me-1"
               onClick={() => {
                  this.props.toggleDisplay();
                  this.setState({ displayMachineConfig: true });
               }}
            >
               Set SSH
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
                  <form>
                     <ProgressBar value={this.state.currentStep} numberOfSteps={this.props.totalNumberOfSteps + 1} />
                     <br />
                     {this.props.steps.map((step, index) => {
                        if (index + 1 === this.state.currentStep) return <div key={index}>{step}</div>;
                        return <div key={index}></div>;
                     })}

                     <div className="mt-3">
                        {this.cancelButton}
                        {this.previousButton}
                        {this.nextButton}
                        {this.submitButton}
                        {this.addModuleButton}
                        {this.addModuleConfigButton}
                        {this.addNewVideoButton}
                        {this.sshButton}
                     </div>
                  </form>
               </Modal.Body>
            </Modal>
            <AddModule
               display={this.state.displayAddModule}
               componentName={this.props.componentName}
               toggleDisplay={() => {
                  this.props.toggleDisplay();
                  this.setState({ displayAddModule: false });
               }}
               updateData={this.props.updateData}
            />
            <AddConfig
               display={this.state.displayAddModuleConfig}
               componentName={this.props.componentName}
               toggleDisplay={() => {
                  this.props.toggleDisplay();
                  this.setState({ displayAddModuleConfig: false });
               }}
               updateData={this.props.updateConfigFiles}
               selectedModule={this.props.selectedModule}
               isUserModule={this.props.isUserModule}
            />
            <AddVideo
               display={this.state.displayAddNewVideo}
               toggleDisplay={() => {
                  this.props.toggleDisplay();
                  this.setState({ displayAddNewVideo: false });
               }}
               componentName={this.props.componentName}
               updateData={this.props.updateData}
            />
            <MachineConfig
               display={this.state.displayMachineConfig}
               onCancel={() => {
                  this.props.toggleDisplay();
                  this.setState({ displayMachineConfig: false });
               }}
               toggleDisplay={() => {
                  this.setState({ displayMachineConfig: !this.state.displayMachineConfig });
               }}
               componentName={this.props.componentName}
               experimentId={this.props.experimentId}
               updateData={this.props.updateData}
            />
         </div>
      );
   }
}
