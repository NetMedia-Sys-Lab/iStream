import React, { Component } from "react";
import Stepper from "src/views/Experiment/Common/Stepper";
import AddVideo from "src/views/Experiment/Common/AddVideo";
import { ComponentsIcons } from "src/models/UserInterface";
import { getUserVideosList, getDefaultVideosList, saveVideoModuleData, getVideoModuleData } from "src/api/VideoAPI";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import InformationButton from "src/views/Common/InformationButton";

import "src/css/style.css";

export default class VideoCard extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      componentName: "Video",
      userVideosList: [],
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

      getDefaultVideosList().then((res) => {
         res.map((element) => (element["isDefault"] = "Yes"));
         this.setState({ defaultVideosList: res });
      });
   }

   fetchData = () => {
      getUserVideosList(this.state.user).then((res) => {
         res.map((element) => (element["isDefault"] = "No"));
         this.setState({ userVideosList: res });
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

   createTable = () => {
      let allVideos = [...this.state.defaultVideosList, ...this.state.userVideosList];

      let videoTableData = allVideos.map((video) => {
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
                  <td>{video.isDefault}</td>
               </tr>
            );
         } else return "";
      });

      let datasetTableData = allVideos.map((video) => {
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
                  <td>{video.isDefault}</td>
               </tr>
            );
         } else return "";
      });

      return [videoTableData, datasetTableData];
   };

   videoSelectionTable = () => {
      const [videoTableData, datasetTableData] = this.createTable();

      return (
         <div>
            <div>
               <h4 style={{ display: "inline" }}>Videos</h4>
               <InformationButton message={"Selected videos move beside the server component in Run directory"} placement={"top"} />
               {this.addNewVideoButton}
            </div>
            <table className="table table-hover p-5">
               <thead className="thead-dark">
                  <tr>
                     <th scope="col">Name</th>
                     <th scope="col">Resolution</th>
                     <th scope="col">Frame Rate</th>
                     <th scope="col">Bit Rate</th>
                     <th scope="col">Default</th>
                  </tr>
               </thead>
               <tbody>{videoTableData}</tbody>
            </table>

            <table className="table table-hover p-5">
               <thead className="thead-dark">
                  <tr>
                     <th scope="col">Dataset Name</th>
                     <th scope="col">Default</th>
                  </tr>
               </thead>
               <tbody>{datasetTableData}</tbody>
            </table>

            <Button className="float-end mt-3" onClick={this.onSubmit}>
               Submit
            </Button>
         </div>
      );
   };

   showModuleConfig = () => {
      if (this.state.showModuleConfiguration !== true) return;

      let allVideos = [...this.state.defaultVideosList, ...this.state.userVideosList];

      return (
         <div style={{ whiteSpace: "nowrap" }}>
            <hr />
            <b>Selected videos:</b>
            {this.state.selectedVideos.map((video, index) => {
               let videoData = allVideos.find((element) => element.id === video);

               return (
                  <div key={index}>
                     {index + 1}. {videoData.name}
                  </div>
               );
            })}
         </div>
      );
   };

   onSubmit = () => {
      this.setState({ showModuleConfiguration: true, displayModal: false });

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

   get addNewVideoButton() {
      const renderTooltip = (props) => (
         <Tooltip id="button-tooltip" {...props}>
            Add New Video or Dataset
         </Tooltip>
      );
      return (
         <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
            <Button
               variant="secondary"
               className="float-end ms-1"
               onClick={() => {
                  this.setState({ displayAddNewVideo: true, displayModal: false });
               }}
            >
               +
            </Button>
         </OverlayTrigger>
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
                  <i className={`component-icon ${ComponentsIcons[this.state.componentName]}`}></i>
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
               // addNewVideoButton={this.addNewVideoButton}
            />

            <AddVideo
               display={this.state.displayAddNewVideo}
               toggleDisplay={() => {
                  this.setState({ displayAddNewVideo: false, displayModal: true });
               }}
               componentName={this.state.componentName}
               updateData={this.fetchData}
            />
         </div>
      );
   }
}
