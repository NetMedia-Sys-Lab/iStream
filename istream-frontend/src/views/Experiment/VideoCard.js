import React, { Component } from "react";
import Stepper from "src/views/Experiment/Common/Stepper";

export default class VideoCard extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      componentName: "Video",
      displayModal: false,
      totalNumberOfSteps: 1,
      showModuleConfiguration: false,
   };

   videoSelection = () => {
      return <div>test</div>;
   };

   render() {
      return (
         <div className="row justify-content-center mx-1">
            <div
               className="center-container"
               style={{ borderRadius: "10px", padding: "20px", cursor: "pointer" }}
               onClick={() => this.setState({ displayModal: true })}
            >
               <h4 className="text-center">
                  <i className="fa fa-play" style={{ color: "#244D5B" }}></i>
                  <br />
                  Video Selection
               </h4>
               {/* {this.showModuleConfig()} */}
            </div>
            <Stepper
               display={this.state.displayModal}
               totalNumberOfSteps={this.state.totalNumberOfSteps}
               // validNextStep={this.state.selectedModule !== "" ? true : false}
               steps={[this.videoSelection()]}
               onSubmit={() => this.setState({ showModuleConfiguration: true })}
               toggleDisplay={() => this.setState({ displayModal: !this.state.displayModal })}
               // isUserModule={this.state.selectedModuleType === "Custom" ? true : false}
               componentName={this.state.componentName}
               // updateData={this.fetchData}
               // updateConfigFiles={this.getOneModuleConfigFiles}
               // selectedModule={this.state.selectedModule}
            />
         </div>
      );
   }
}
