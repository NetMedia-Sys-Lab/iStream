import React, { Component } from "react";
import Header from "src/views/Common/Header";
import CustomModulesTable from "src/views/Setting/customModulesTable";
// import { getUserMachineList, deleteUserMachine } from "src/api/ExperimentAPI";
// import { getVideosList, deleteUserVideo } from "src/api/ModulesAPI";
import InformationButton from "src/views/Common/InformationButton";
// import { toast } from "react-toastify";

export default class Setting extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      machineList: [],
      videosList: [],
   };

   constructor(props) {
      super(props);

      this.fetchData();
   }

   fetchData = () => {
      // getUserMachineList(this.state.user).then((res) => {
      //    this.setState({ machineList: res });
      // });
      // getVideosList(this.state.user).then((res) => {
      //    this.setState({ videosList: res });
      // });
   };

   deleteUserMachine = (machineID) => {
      // deleteUserMachine(this.state.user, machineID).then((res) => {
      //    this.fetchData();
      //    toast.success(res);
      // });
   };

   deleteUserVideo = (videoID) => {
      // deleteUserVideo(this.state.user, videoID).then((res) => {
      //    this.fetchData();
      //    toast.success(res);
      // });
   };

   machinesTable = () => {
      if (this.state.machineList.length === 0)
         return (
            <div>
               <h4>Machines</h4>
               <table className="table">
                  <thead className="thead-dark"></thead>
                  <tbody>
                     <tr>
                        <td>No machine found.</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         );

      const tableData = this.state.machineList.map((machine) => {
         return (
            <tr key={machine.machineID}>
               <td className="align-middle col-9">
                  {machine.machineIp} - {machine.sshUsername} - {machine.privateKeyName}
               </td>
               <td className="align-middle col-3">
                  <button
                     className="btn btn-light mx-1 experiment-button"
                     title="Delete Machine"
                     onClick={() => this.deleteUserMachine(machine.machineID)}
                  >
                     <i className="fa fa-trash text-danger" style={{ cursor: "pointer" }}></i>
                  </button>
               </td>
            </tr>
         );
      });

      return (
         <div>
            <h4>
               Machines
               <InformationButton message="IP - Username - Private Key" />
            </h4>
            <table className="table">
               <thead className="thead-dark"></thead>
               <tbody>{tableData}</tbody>
            </table>
         </div>
      );
   };

   videosTable = () => {
      if (this.state.videosList.filter((item) => !item.isDataset).length === 0)
         return (
            <div>
               <h4>Videos</h4>
               <table className="table">
                  <thead className="thead-dark"></thead>
                  <tbody>
                     <tr>
                        <td>No videos found.</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         );
      const videoTableData = this.state.videosList.map((video) => {
         if (!video.isDataset) {
            return (
               <tr key={video.id}>
                  <td className="align-middle col-9">
                     {video.name} - {video.resolution} - {video.frameRate} - {video.bitRate}
                  </td>
                  <td className="align-middle col-3">
                     <button
                        className="btn btn-light mx-1 experiment-button"
                        title="Delete Video"
                        onClick={() => this.deleteUserVideo(video.id)}
                     >
                        <i className="fa fa-trash text-danger" style={{ cursor: "pointer" }}></i>
                     </button>
                  </td>
               </tr>
            );
         } else return "";
      });

      return (
         <div>
            <h4>
               Videos
               <InformationButton message="Name - Resolution - Frame rate - Bit rate" />
            </h4>

            <table className="table">
               <thead className="thead-dark"></thead>
               <tbody>{videoTableData}</tbody>
            </table>
         </div>
      );
   };

   datasetTable = () => {
      if (this.state.videosList.filter((item) => item.isDataset).length === 0)
         return (
            <div>
               <h4>Dataset</h4>
               <table className="table">
                  <thead className="thead-dark"></thead>
                  <tbody>
                     <tr>
                        <td>No dataset found.</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         );
      const datasetTableData = this.state.videosList.map((video) => {
         if (video.isDataset) {
            return (
               <tr key={video.id}>
                  <td className="align-middle col-9">{video.name}</td>
                  <td className="align-middle col-3">
                     <button
                        className="btn btn-light mx-1 experiment-button"
                        title="Delete Dataset"
                        onClick={() => this.deleteUserVideo(video.id)}
                     >
                        <i className="fa fa-trash text-danger" style={{ cursor: "pointer" }}></i>
                     </button>
                  </td>
               </tr>
            );
         } else return "";
      });

      return (
         <div>
            <div>
               <h4>Datasets</h4>
            </div>
            <table className="table">
               <thead className="thead-dark"></thead>
               <tbody>{datasetTableData}</tbody>
            </table>
         </div>
      );
   };

   render() {
      return (
         <main>
            <div className="h-100 main-height">
               <Header />
               <div className="container">
                  <div className="row mt-4">
                     <h2 className="col-md-10">User Custom Modules</h2>
                     <div className="row justify-content-center">
                        <div className="center-container">
                           <CustomModulesTable componentName="Transcoder" />
                           <CustomModulesTable componentName="Server" />
                           <CustomModulesTable componentName="Network" />
                           <CustomModulesTable componentName="Client" />
                           {this.machinesTable()}
                           {this.videosTable()}
                           {this.datasetTable()}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </main>
      );
   }
}
