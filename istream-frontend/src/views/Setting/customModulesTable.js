import React, { Component } from "react";
import { getModules, deleteUserModule } from "src/api/ComponentsAPI";
import { toast } from "react-toastify";

export default class CustomModulesTable extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      userModules: [],
   };

   constructor(props) {
      super(props);
      this.fetchData();
   }

   fetchData = () => {
      getModules(this.state.user, this.props.componentName).then((res) => {
         this.setState({ userModules: res.user });
      });
   };

   deleteUserModule = (moduleId) => {
      deleteUserModule(this.state.user, this.props.componentName, moduleId).then((res) => {
         this.fetchData();
         toast.success(res);
      });
   };

   userModulesTable = () => {
      if (this.state.userModules.length === 0)
         return (
            <div>
               <table className="table">
                  <thead className="thead-dark"></thead>
                  <tbody>
                     <tr>
                        <td>No user module found for this component.</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         );

      const tableData = this.state.userModules.map((module, index) => {
         return (
            <tr key={index}>
               <td className="align-middle col-9">{module["name"]}</td>

               <td className="align-middle col-3">
                  <button
                     className="btn btn-light mx-1 experiment-button"
                     title="Delete Module"
                     onClick={() => this.deleteUserModule(module["id"])}
                  >
                     <i className="fa fa-trash text-danger" style={{ cursor: "pointer" }}></i>
                  </button>
               </td>
            </tr>
         );
      });

      return (
         <table className="table">
            <thead className="thead-dark"></thead>
            <tbody>{tableData}</tbody>
         </table>
      );
   };

   render() {
      return (
         <div>
            <h4>{this.props.componentName} Modules</h4>
            {this.userModulesTable()}
         </div>
      );
   }
}
