import React, { Component } from "react";
import Stepper from "src/views/Experiment/Common/Stepper";
import AddVideo from "src/views/Experiment/Common/AddVideo";
import { getVideosList, getDefaultVideosList } from "src/api/ModulesAPI";
import { Button } from "react-bootstrap";

import "src/css/style.css";
import { toast } from "react-toastify";

export default class VideoCard extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      componentName: "Video",
      videosList: [],
      defaultVideosList: [],
      selectedVideos: [],
      displayModal: false,
      totalNumberOfSteps: 1,
      showModuleConfiguration: false,
      machineID: "",
      displayAddNewVideo: false,
   };

   componentDidMount() {
      this.fetchData();
   }

   fetchData = () => {
      getDefaultVideosList().then((res) => {
         this.setState({ defaultVideosList: res });
      });
      getVideosList(this.state.user).then((res) => {
         this.setState({ videosList: res });
      });
      // getVideoModuleData(this.state.user, this.state.componentName, this.props.experimentId).then((res) => {
      //    if (res.id.length > 0) this.setState({ selectedVideos: res.id, showModuleConfiguration: true, machineID: res.machineID });
      // });
   };

   onVideoClick = (videoId, type) => {
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

   tableRow = (list, isDataset) => {
      return list.map((video) => {
         let isSelected = false;
         if (this.state.selectedVideos.some((element) => video.id === element)) {
            isSelected = true;
         }

         if (video.isDataset === isDataset) {
            return (
               <tr
                  key={video.id}
                  onClick={() => this.onVideoClick(video.id)}
                  className={isSelected ? "selectedRow" : ""}
                  style={{ cursor: "pointer" }}
               >
                  <td>{video.name}</td>
                  <td>{video.resolution}</td>
                  <td>{video.frameRate}</td>
                  <td>{video.bitRate}</td>
               </tr>
            );
         } else return "";
      });
   };

   videoSelectionTable = () => {
      let videoTableData = this.state.defaultVideosList.map((video) => {
         let isSelected = false;
         if (this.state.selectedVideos.some((element) => video.id === element)) {
            isSelected = true;
         }

         if (!video.isDataset) {
            return (
               <tr
                  key={video.id}
                  onClick={() => this.onVideoClick(video.id)}
                  className={isSelected ? "selectedRow" : ""}
                  style={{ cursor: "pointer" }}
               >
                  <td>{video.name}</td>
                  <td>{video.resolution}</td>
                  <td>{video.frameRate}</td>
                  <td>{video.bitRate}</td>
               </tr>
            );
         } else return "";
      });

      videoTableData += this.state.videosList.map((video) => {
         let isSelected = false;
         if (this.state.selectedVideos.some((element) => video.id === element)) {
            isSelected = true;
         }

         if (!video.isDataset) {
            return (
               <tr
                  key={video.id}
                  onClick={() => this.onVideoClick(video.id)}
                  className={isSelected ? "selectedRow" : ""}
                  style={{ cursor: "pointer" }}
               >
                  <td>{video.name}</td>
                  <td>{video.resolution}</td>
                  <td>{video.frameRate}</td>
                  <td>{video.bitRate}</td>
               </tr>
            );
         } else return "";
      });

      const datasetTableData = this.state.videosList.map((video) => {
         let isSelected = false;
         if (this.state.selectedVideos.some((element) => video.id === element)) {
            isSelected = true;
         }

         if (video.isDataset) {
            return (
               <tr
                  key={video.id}
                  onClick={() => this.onVideoClick(video.id)}
                  className={isSelected ? "selectedRow" : ""}
                  style={{ cursor: "pointer" }}
               >
                  <td>{video.name}</td>
               </tr>
            );
         } else return "";
      });

      return (
         <div>
            <h4>Videos</h4>
            <table className="table table-hover p-5">
               <thead className="thead-dark">
                  <tr>
                     <th scope="col">Video Name</th>
                     <th scope="col">Resolution</th>
                     <th scope="col">Frame Rate</th>
                     <th scope="col">Bit Rate</th>
                  </tr>
               </thead>
               <tbody>{videoTableData}</tbody>
            </table>

            <table className="table table-hover p-5">
               <thead className="thead-dark">
                  <tr>
                     <th scope="col">Dataset Name</th>
                  </tr>
               </thead>
               <tbody>{datasetTableData}</tbody>
            </table>

            {this.addNewVideoButton}
         </div>
      );
   };

   showModuleConfig = () => {
      if (this.state.showModuleConfiguration !== true) return;

      return (
         <div style={{ whiteSpace: "nowrap" }}>
            <hr />
            <b>Selected videos:</b>
            {this.state.selectedVideos.map((video, index) => {
               let videoData = this.state.videosList.find((element) => element.id === video);

               return (
                  <div key={index}>
                     {index + 1}. {videoData.name}
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

      // saveVideoModuleData(data).then((res) => {
      //    toast.success(res);
      // });
   };

   get addNewVideoButton() {
      return (
         <Button
            variant="secondary"
            className="float-end me-1"
            onClick={() => {
               // this.props.toggleDisplay();
               this.setState({ displayAddNewVideo: true });
            }}
         >
            Add New
         </Button>
      );
   }

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
               // onSubmit={this.onSubmit}
               toggleDisplay={() => this.setState({ displayModal: !this.state.displayModal })}
               componentName={this.state.componentName}
            />
         </div>
      );
   }
}
