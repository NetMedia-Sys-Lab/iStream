import React, { Component } from "react";
import { getUserExperimentsList } from "src/api/ExperimentAPI";

export default class ExperimentsList extends Component {
   state = {
      userExperimentsList: [],
      user: JSON.parse(localStorage.getItem("user")),
   };

   componentDidMount() {
      getUserExperimentsList(this.state.user).then((res) => {
         this.setState({ userExperimentsList: res });
      });
   }

   render() {
      const tableData = this.state.userExperimentsList.map((experiment) => {
         return (
            <tr key={experiment.experimentId}>
               <td className="align-middle">{experiment.experimentName}</td>
               <td className="align-middle">{experiment.description}</td>
               <td className="align-middle">{experiment.experimentDate}</td>
               <td className="align-middle">
                  <button
                     className="btn btn-light mx-1 experiment-button"
                     title="Open Experiment"
                     onClick={() => this.gotoSelectedExperiment(experiment.experimentId)}
                  >
                     <i className="fa fa-folder text-primary" style={{ cursor: "pointer" }}></i>
                  </button>
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
   }
}
