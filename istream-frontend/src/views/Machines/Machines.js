import React, { Component } from "react";
import Header from "src/views/Common/Header";
import { getUserMachineList, deleteUserMachine, addNewMachine } from "src/api/MachinesAPI";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

export default class Machines extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      machineList: [],
      displayAddNewMachine: false,
      machineIP: "",
      sshUsername: "",
      privateKey: null,
   };

   constructor(props) {
      super(props);

      this.fetchData();
   }

   fetchData = () => {
      getUserMachineList(this.state.user).then((res) => {
         this.setState({ machineList: res });
      });
   };

   deleteUserMachine = (machineID) => {
      deleteUserMachine(this.state.user, machineID).then((res) => {
         this.fetchData();
         toast.success(res);
      });
   };

   machinesTable = () => {
      if (this.state.machineList.length === 0)
         return (
            <p className="text-center">
               <b>No user machine found. </b>
            </p>
         );

      const tableData = this.state.machineList.map((machine) => {
         return (
            <tr key={machine.machineID}>
               <td>{machine.machineIp}</td>
               <td>{machine.sshUsername}</td>
               <td>{machine.privateKeyName}</td>

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
            <table className="table">
               <thead className="thead-dark">
                  <tr>
                     <th scope="col">Machine IP</th>
                     <th scope="col">Username</th>
                     <th scope="col">Private Key Name</th>
                     <th scope="col">Delete</th>
                  </tr>
               </thead>
               <tbody>{tableData}</tbody>
            </table>
         </div>
      );
   };

   submitNewMachine = (event) => {
      event.preventDefault();

      var newMachineData = new FormData();
      newMachineData.append("userId", this.state.user.userId);
      newMachineData.append("username", this.state.user.username);
      newMachineData.append("machineIp", this.state.machineIP);
      newMachineData.append("sshUsername", this.state.sshUsername);
      newMachineData.append("privateKey", this.state.privateKey);

      addNewMachine(newMachineData).then((res) => {
         toast.success(res);
         this.setState({
            machineIP: "",
            sshUsername: "",
            privateKey: null,
            displayAddNewMachine: false,
         });
         this.fetchData();
      });
   };

   onAddNewMachine = () => {
      return (
         <div>
            <Modal dialogClassName="modal-size" show={this.state.displayAddNewMachine} className="blur">
               <Modal.Header>
                  <Modal.Title>Add New Machine</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <form onSubmit={this.submitNewMachine}>
                     <div className="form-group row">
                        <label className="col-6 col-form-label">Machine IP: </label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="text"
                              onChange={(event) => {
                                 this.setState({ machineIP: event.target.value });
                              }}
                              required
                           />
                        </div>
                     </div>
                     <div className="form-group row mt-2">
                        <label className="col-6 col-form-label">Username: </label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="text"
                              onChange={(event) => {
                                 this.setState({ sshUsername: event.target.value });
                              }}
                              required
                           />
                        </div>
                     </div>
                     <div className="form-group row mt-2">
                        <label className="col-6 col-form-label">Upload Private Key</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="file"
                              id="privateKey"
                              name="privateKey"
                              onChange={(event) => this.setState({ privateKey: event.target.files[0] })}
                              required
                           />
                        </div>
                     </div>
                     <div className="mt-3">
                        <Button
                           onClick={() => {
                              this.props.toggleDisplay();
                              this.setState({ displayAddNewMachine: false });
                           }}
                           variant="danger"
                        >
                           Cancel
                        </Button>
                        <Button className="float-end" type="submit">
                           Submit
                        </Button>
                     </div>
                  </form>
               </Modal.Body>
            </Modal>
         </div>
      );
   };

   render() {
      return (
         <main>
            <div className="h-100 main-height">
               <Header />
               <div className="container">
                  <div className="row justify-content-end mt-4">
                     <h2 className="col-md-10">Machines</h2>
                     <Button className="col-md-2" onClick={() => this.setState({ displayAddNewMachine: true })}>
                        Add Machine
                     </Button>
                  </div>

                  {this.onAddNewMachine()}

                  <div className="row justify-content-center">
                     <div className="center-container">{this.machinesTable()}</div>
                  </div>
               </div>
            </div>
         </main>
      );
   }
}
