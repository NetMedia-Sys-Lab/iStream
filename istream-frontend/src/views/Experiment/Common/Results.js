import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import b64ToBlob from "b64-to-blob";
import fileSaver from "file-saver";
import { toast } from "react-toastify";

import { getExperimentResults, downloadResult, downloadExperimentResults, deleteResult } from "src/api/ExperimentAPI";

export default class Results extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      displayResultsModal: false,
      resultsName: [],
   };

   getExperimentResults = () => {
      getExperimentResults(this.state.user, this.props.experimentId).then((res) => {
         this.setState({ resultsName: res, displayResultsModal: true });
      });
   };

   downloadAllResults = () => {
      downloadExperimentResults(this.state.user.username, this.props.experimentId).then((response) => {
         const blob = b64ToBlob(response, "application/zip");
         fileSaver.saveAs(blob, `results.zip`);
      });
   };

   downloadResult = (resultName) => {
      downloadResult(this.state.user, this.props.experimentId, resultName).then((res) => {
         const blob = b64ToBlob(res, "application/zip");
         fileSaver.saveAs(blob, `${resultName}.zip`);
      });
   };

   deleteResult = (resultName) => {
      const data = {
         userId: this.state.user.userId,
         username: this.state.user.username,
         experimentId: this.props.experimentId,
         resultName: resultName,
      };

      deleteResult(data).then((res) => {
         toast.success(res);
         this.getExperimentResults();
      });
   };

   showTable = () => {
      const tableData = this.state.resultsName.map((result) => {
         return (
            <tr key={result}>
               <td className="align-middle">{result}</td>

               <td className="align-middle">
                  <button className="btn btn-light mx-1 experiment-button" title="Delete Result" onClick={() => this.deleteResult(result)}>
                     <i className="fa fa-trash text-danger" style={{ cursor: "pointer" }}></i>
                  </button>
                  <button
                     className="btn btn-light mx-1 experiment-button"
                     title="Download Result"
                     onClick={() => this.downloadResult(result)}
                  >
                     <i className="fa fa-download text-success" style={{ cursor: "pointer" }}></i>
                  </button>
               </td>
            </tr>
         );
      });

      return (
         <table className="table table-hover">
            <thead className="thead-dark">
               <tr>
                  <th scope="col">Result Name</th>
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
            <b>No results found.</b>
         </p>
      );
   };

   resultsModal = () => {
      return (
         <div>
            <Modal show={this.state.displayResultsModal}>
               <Modal.Header>
                  <Modal.Title>Results</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <div>
                     {this.state.resultsName.length === 0 ? (
                        this.emptyTable()
                     ) : (
                        <div>
                           {this.showTable()}
                           <Button onClick={this.downloadAllResults} className="float-end" variant="primary">
                              <i className="fa fa-download"></i> All results
                           </Button>
                        </div>
                     )}

                     <Button onClick={() => this.setState({ displayResultsModal: false })} variant="danger">
                        Cancel
                     </Button>
                  </div>
               </Modal.Body>
            </Modal>
         </div>
      );
   };

   render() {
      return (
         <div>
            <Button className="float-end me-2" variant="info" onClick={this.getExperimentResults}>
               Results
            </Button>
            {this.resultsModal()}
         </div>
      );
   }
}
