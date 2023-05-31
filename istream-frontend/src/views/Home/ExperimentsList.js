import React, { Component } from "react";
import { toast } from "react-toastify";
import { getUserExperimentsList, deleteExperiment, duplicateExperiment } from "src/api/HomeAPI";
import { runBatchOfExperiments } from "src/api/ExperimentAPI";
import { Button } from "react-bootstrap";

export default class ExperimentsList extends Component {
   state = {
      userExperimentsList: [],
      user: JSON.parse(localStorage.getItem("user")),
      selectedExperiments: [],
   };

   componentDidMount() {
      this.fetchUserExperiments();
   }

   fetchUserExperiments = () => {
      getUserExperimentsList(this.state.user).then((res) => {
         this.setState({ userExperimentsList: res });
      });
   };

   gotoSelectedExperiment = (experimentId) => {
      window.location.assign(`/experiment/${experimentId}`);
   };

   deleteSelectedExperiment = (experimentId) => {
      const data = {
         userId: this.state.user.userId,
         username: this.state.user.username,
         experimentId: experimentId,
      };

      deleteExperiment(data).then((res) => {
         toast.success(res);
         this.fetchUserExperiments();
      });
   };

   duplicateSelectedExperiment = (experimentId) => {
      let experimentName = prompt("Enter Experiment Name");
      if (experimentName === null || experimentName === "") {
         toast.warn("Please enter a valid experiment name");
         return;
      }

      const data = {
         userId: this.state.user.userId,
         username: this.state.user.username,
         oldExperimentId: experimentId,
         experimentName: experimentName,
         newExperimentId: Date.now().toString(),
      };

      duplicateExperiment(data).then((res) => {
         toast.success(res);
         this.fetchUserExperiments();
      });
   };

   addToRunList = (experimentId) => {
      let tempList = this.state.selectedExperiments;

      if (tempList.some((e) => e.experimentId === experimentId)) tempList = tempList.filter((e) => e.experimentId !== experimentId);
      else tempList.push({ experimentId, repetition: 1 });

      this.setState({ selectedExperiments: tempList });
   };

   runBatchOfExperiments = () => {
      const data = {
         userId: this.state.user.userId,
         username: this.state.user.username,
         selectedExperiments: this.state.selectedExperiments,
      };
      runBatchOfExperiments(data).then((res) => {
         toast.success(res);
      });
   };

   showTable = () => {
      const tableData = this.state.userExperimentsList.map((experiment) => {
         return (
            <tr key={experiment.experimentId}>
               <td
                  onClick={() => this.gotoSelectedExperiment(experiment.experimentId)}
                  className="align-middle"
                  style={{ cursor: "pointer" }}
               >
                  {experiment.experimentName}
               </td>
               <td
                  onClick={() => this.gotoSelectedExperiment(experiment.experimentId)}
                  className="align-middle"
                  style={{ cursor: "pointer" }}
               >
                  {experiment.description}
               </td>
               <td
                  onClick={() => this.gotoSelectedExperiment(experiment.experimentId)}
                  className="align-middle"
                  style={{ cursor: "pointer" }}
               >
                  {experiment.experimentDate}
               </td>
               <td className="align-middle">
                  <div className="row">
                     <div className="col-1 me-2">
                        <button
                           className="btn btn-light experiment-button"
                           title="Delete Experiment"
                           onClick={() => this.deleteSelectedExperiment(experiment.experimentId)}
                        >
                           <i className="fa fa-trash text-danger" style={{ cursor: "pointer" }}></i>
                        </button>
                     </div>
                     <div className="col-1 me-2">
                        <button
                           className="btn btn-light experiment-button"
                           title="Duplicate Experiment"
                           onClick={() => this.duplicateSelectedExperiment(experiment.experimentId)}
                        >
                           <i className="fa fa-copy text-success" style={{ cursor: "pointer" }}></i>
                        </button>
                     </div>
                     <div className="col-1 me-2">
                        <button
                           className="btn btn-light experiment-button"
                           title="Schedule Experiment"
                           onClick={() => this.addToRunList(experiment.experimentId)}
                        >
                           <i className="fa fa-hourglass" style={{ cursor: "pointer", color: "#244D5A" }}></i>
                        </button>
                     </div>
                     {this.state.selectedExperiments.some((e) => e.experimentId === experiment.experimentId) ? (
                        <div className="col-3 ms-2">
                           <input
                              className="form-control input-sm"
                              type="number"
                              placeholder="1"
                              onChange={(event) => {
                                 let tempList = this.state.selectedExperiments;
                                 let objIndex = tempList.findIndex((obj) => obj.experimentId === experiment.experimentId);
                                 if (Number(event.target.value) === 0) tempList[objIndex].repetition = 1;
                                 else tempList[objIndex].repetition = Number(event.target.value);
                                 this.setState({ selectedExperiments: tempList });
                              }}
                           />
                        </div>
                     ) : (
                        <div></div>
                     )}
                  </div>
               </td>
            </tr>
         );
      });

      return (
         <table className="table table-hover fixed-table">
            <thead className="thead-dark">
               <tr>
                  <th scope="col" style={{ width: "20%" }}>
                     Experiment Name
                  </th>
                  <th scope="col" style={{ width: "30%" }}>
                     Description
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                     Date Created
                  </th>
                  <th scope="col" style={{ width: "30%" }}>
                     Actions
                  </th>
               </tr>
            </thead>
            <tbody>{tableData}</tbody>
         </table>
      );
   };

   emptyTable = () => {
      return (
         <p className="text-center">
            <b>No experiments found. Please create an experiment first. </b>
         </p>
      );
   };

   render() {
      return (
         <div>
            <div className="row justify-content-center">
               <div className="center-container">{this.state.userExperimentsList.length === 0 ? this.emptyTable() : this.showTable()}</div>
            </div>
            <div>
               {this.state.selectedExperiments.length > 0 ? (
                  <Button className="float-end me-2" variant="success" onClick={this.runBatchOfExperiments}>
                     Run Experiments
                  </Button>
               ) : (
                  ""
               )}
            </div>
         </div>
      );
   }
}
