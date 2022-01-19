import React, { Component } from "react";
import { toast } from "react-toastify";
import { getUserExperimentsList, deleteExperiment } from "src/api/ExperimentAPI";

export default class ExperimentsList extends Component {
   state = {
      userExperimentsList: [],
      user: JSON.parse(localStorage.getItem("user")),
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
      console.log("here");
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
      const data = {
         userId: this.state.user.userId,
         username: this.state.user.username,
         experimentId: experimentId,
      };
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
                  <button
                     className="btn btn-light mx-1 experiment-button"
                     title="Delete Experiment"
                     onClick={() => this.deleteSelectedExperiment(experiment.experimentId)}
                  >
                     <i className="fa fa-trash text-danger" style={{ cursor: "pointer" }}></i>
                  </button>
                  <button
                     className="btn btn-light mx-1 experiment-button"
                     title="Duplicate Experiment"
                     onClick={() => this.duplicateSelectedExperiment(experiment.experimentId)}
                  >
                     <i className="fa fa-copy text-success" style={{ cursor: "pointer" }}></i>
                  </button>
               </td>
            </tr>
         );
      });

      return (
         <table className="table table-hover">
            <thead className="thead-dark">
               <tr>
                  <th scope="col">Experiment Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Date Created</th>
                  <th scope="col">Actions</th>
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
            {this.state.userExperimentsList.length === 0 ? this.emptyTable() : this.showTable()}
         </div>
      );
   }
}
