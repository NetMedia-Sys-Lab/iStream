import React, { Component } from "react";
import Stepper from "src/views/Experiment/Common/Stepper";
import { getVideosList, saveVideoModuleData, getVideoModuleData } from "src/api/ModulesAPI";
import "./Experiment.css";
import { toast } from "react-toastify";

export default class VideoCard extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      componentName: "Video",
      videosList: [],
      selectedVideos: [],
      displayModal: false,
      totalNumberOfSteps: 1,
      showModuleConfiguration: false,
      machineID: "",
   };

   componentDidMount() {
      this.fetchData();
   }

   fetchData = () => {
      getVideosList(this.state.user).then((res) => {
         this.setState({ videosList: res });
      });

      getVideoModuleData(this.state.user, this.state.componentName, this.props.experimentId).then((res) => {
         if (res.id.length > 0) this.setState({ selectedVideos: res.id, showModuleConfiguration: true, machineID: res.machineID });
      });
   };

   onVideoClick = (videoId) => {
      if (this.state.selectedVideos.some((element) => videoId === element)) {
         this.setState({
            selectedVideos: this.state.selectedVideos.filter(function (element) {
               return element !== videoId;
            }),
         });
      } else {
         this.setState({ selectedVideos: [...this.state.selectedVideos, videoId] });
      }
   };

   videoSelectionTable = () => {
      const tableData = this.state.videosList.map((video) => {
         let isSelected = false;
         if (this.state.selectedVideos.some((element) => video.videoId === element)) {
            isSelected = true;
         }

         return (
            <tr
               key={video.videoId}
               onClick={() => this.onVideoClick(video.videoId)}
               className={isSelected ? "selectedRow" : ""}
               style={{ cursor: "pointer" }}
            >
               <td>{video.name}</td>
               <td>{video.resolution}</td>
               <td>{video.frameRate}</td>
               <td>{video.bitRate}</td>
            </tr>
         );
      });

      return (
         <table className="table table-hover p-5">
            <thead className="thead-dark">
               <tr>
                  <th scope="col">Video Name</th>
                  <th scope="col">Resolution</th>
                  <th scope="col">Frame Rate</th>
                  <th scope="col">Bit Rate</th>
               </tr>
            </thead>
            <tbody>{tableData}</tbody>
         </table>
      );
   };

   showModuleConfig = () => {
      if (this.state.showModuleConfiguration !== true) return;

      return (
         <div>
            <hr />
            <b>Selected videos:</b>
            {this.state.selectedVideos.map((video, index) => {
               let videoData = this.state.videosList.find((element) => element.videoId === video);
               return (
                  <div key={index}>
                     {index + 1}. {videoData.name} - {videoData.resolution}
                  </div>
               );
            })}
            {this.state.machineID !== "" && this.state.machineID !== "0" ? (
               <div>
                  <strong>Machine IP: </strong>
                  {this.state.machineID}
               </div>
            ) : (
               ""
            )}
         </div>
      );
   };

   onSubmit = () => {
      this.setState({ showModuleConfiguration: true });

      const data = {
         userId: this.state.user.userId,
         username: this.state.user.username,
         componentName: this.state.componentName,
         experimentId: this.props.experimentId,
         videoList: this.state.selectedVideos,
      };

      saveVideoModuleData(data).then((res) => {
         toast.success(res);
      });
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
                  {this.state.componentName}
               </h4>
               {this.showModuleConfig()}
            </div>
            <Stepper
               display={this.state.displayModal}
               totalNumberOfSteps={this.state.totalNumberOfSteps}
               steps={[this.videoSelectionTable()]}
               onSubmit={this.onSubmit}
               toggleDisplay={() => this.setState({ displayModal: !this.state.displayModal })}
               componentName={this.state.componentName}
               updateData={this.fetchData}
               experimentId={this.props.experimentId}
            />
         </div>
      );
   }
}
