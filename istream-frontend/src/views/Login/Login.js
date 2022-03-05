import React, { Component } from "react";
import { toast } from "react-toastify";
import { getAllUsers } from "src/api/UserAPI";

export default class Login extends Component {
   state = {
      allUsers: [],
      selectedUser: "",
   };

   componentDidMount() {
      getAllUsers()
         .then((ServerUsers) => {
            if (ServerUsers.length === 0) {
               toast.warn("No registered users found");
            } else {
               this.setState({
                  allUsers: ServerUsers,
                  selectedUser: ServerUsers[0].userId,
               });
            }
         })
         .catch((error) => toast.warn(error.data));
   }

   handleChange = (event) => {
      console.log(event.target.value);
      this.setState({
         selectedUser: parseInt(event.target.value),
      });
   };

   handleLogin = (event) => {
      event.preventDefault();
      if (this.state.selectedUser === "") {
         return;
      }

      const currentUser = this.state.allUsers.find(
         (user) => user.userId === this.state.selectedUser
      );

      localStorage.setItem("user", JSON.stringify(currentUser));
      window.location.assign("home");
   };

   render() {
      return (
         <main>
            <div className="container h-100">
               <div className="row justify-content-center align-items-center main-height">
                  <div className="center-container col-md-8">
                     <h1 className="center-text">Welcome to iStream</h1>
                     <hr />
                     {this.state.allUsers.length === 0 ? (
                        <div>There are no users registered for iStream. Please register first.</div>
                     ) : (
                        <div className="form-group mb-4">
                           <div className="row justify-content-center align-items-center">
                              <div className="col-md-2">
                                 <label className="form-label">
                                    <b>Username:</b>
                                 </label>
                              </div>
                              <div className="col-md-7">
                                 <select
                                    className="col-md-6 form-select"
                                    name="users"
                                    id="users"
                                    onChange={this.handleChange}
                                 >
                                    {this.state.allUsers.map((user) => {
                                       return (
                                          <option key={user.userId} value={user.userId}>
                                             {user.username}
                                          </option>
                                       );
                                    })}
                                 </select>
                              </div>
                           </div>
                        </div>
                     )}

                     <div className="row justify-content-center">
                        <div className="col-sm-4">
                           <button className="green-button" onClick={this.handleLogin}>
                              Login
                           </button>
                        </div>
                     </div>
                     <p className="text-center text-muted mt-3 mb-0">
                        New user?{" "}
                        <a href="/register" className="fw-bold text-body">
                           <u>Register Now</u>
                        </a>
                     </p>
                  </div>
               </div>
            </div>
         </main>
      );
   }
}
