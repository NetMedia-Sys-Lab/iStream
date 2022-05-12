import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { addNewMachine, getUserMachineList, saveComponentMachineInfo, getComponentSelectedMachine } from "src/api/ExperimentAPI";
import { toast } from "react-toastify";

export default class MachineConfig extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      machineList: [{ machineID: "0", sshUsername: "No Machine" }],
      displayAddNewMachine: false,
      machineIP: "",
      sshUsername: "",
      privateKey: null,
      selectedMachine: null,
   };

   constructor(props) {
      super(props);
      this.fetchData();
      getComponentSelectedMachine(this.state.user, this.props.componentName, this.props.experimentId).then((res) => {
         if (res !== "") this.setState({ selectedMachine: String(res) });
      });
   }

   fetchData() {
      getUserMachineList(this.state.user).then((res) => {
         res.unshift({ machineID: "0", sshUsername: "No Machine" });
         this.setState({ machineList: res });
      });
   }

   machineSelectionTable = () => {
      if (this.state.machineList.length === 0) return "No machine found. Please add one first.";

      const tableData = this.state.machineList.map((machine) => {
         let isSelected = false;
         if (this.state.selectedMachine === machine.machineID) {
            isSelected = true;
         }

         return (
            <tr
               key={machine.machineID}
               onClick={() => this.setState({ selectedMachine: machine.machineID })}
               className={isSelected ? "selectedRow" : ""}
               style={{ cursor: "pointer" }}
            >
               <td>{machine.machineIp}</td>
               <td>{machine.sshUsername}</td>
               <td>{machine.privateKeyName}</td>
            </tr>
         );
      });

      return (
         <table className="table table-hover p-5">
            <thead className="thead-dark">
               <tr>
                  <th scope="col">Machine IP</th>
                  <th scope="col">Username</th>
                  <th scope="col">Private Key Name</th>
               </tr>
            </thead>
            <tbody>{tableData}</tbody>
         </table>
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
         this.fetchData();
         this.setState({
            machineIP: "",
            sshUsername: "",
            privateKey: null,
            displayAddNewMachine: false,
         });
         this.props.toggleDisplay();
      });
   };

   onAddNewMachine = () => {
      return (
         <div>
            <Modal dialogClassName="modal-size" show={this.state.displayAddNewMachine}>
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

   onSubmit = () => {
      const data = {
         userId: this.state.user.userId,
         username: this.state.user.username,
         componentName: this.props.componentName,
         experimentId: this.props.experimentId,
         machineID: this.state.selectedMachine,
      };

      saveComponentMachineInfo(data).then((res) => {
         this.props.onCancel();
         this.props.updateData();
         toast.success(res);
      });
   };

   render() {
      return (
         <div>
            <Modal dialogClassName="modal-size" show={this.props.display}>
               <Modal.Header>
                  <Modal.Title>Machines Registered</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  {this.machineSelectionTable()}

                  <div className="mt-3">
                     <Button onClick={this.props.onCancel} variant="danger">
                        Cancel
                     </Button>
                     <Button className="float-end" type="submit" onClick={this.onSubmit}>
                        Save
                     </Button>
                     <Button
                        className="float-end me-1"
                        variant="secondary"
                        onClick={() => {
                           this.props.toggleDisplay();
                           this.setState({ displayAddNewMachine: true });
                        }}
                     >
                        Add New
                     </Button>
                  </div>
               </Modal.Body>
            </Modal>
            {this.onAddNewMachine()}
         </div>
      );
   }
}
