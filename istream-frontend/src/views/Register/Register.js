import React, { Component } from "react";
import { toast } from "react-toastify";
import { userRegistration } from "src/api/UserAPI";

export default class Register extends Component {
   state = {
      username: "",
      email: "",
      comments: "",
   };

   handleChange = (event) => {
      this.setState({
         [event.target.id]: event.target.value,
      });
   };

   submitRegistration = (event) => {
      event.preventDefault();

      if (
         this.state.username === "" ||
         this.state.username === null ||
         this.state.email === "" ||
         this.state.email === null
      ) {
         toast.error("Please enter an username and an email");
         return;
      }

      userRegistration(this.state)
         .then((res) => {
            toast.success("User registered successfully.");
         })
         .catch((error) => toast.warn(error));

      // .then(
      // 	()=>{window.location.assign('/login')}
      // )
   };

   render() {
      return (
         <main>
            <div className="container h-100">
               <div className="row justify-content-center align-items-center main-height">
                  <div className="col-md-8">
                     <form
                        className="center-container"
                        onSubmit={this.submitRegistration}
                     >
                        <h2 className="text-center">Create an account</h2>
                        <hr />
                        <div className="form-group mb-4">
                           <div className="row justify-content-center align-items-center">
                              <div className="col-md-3">
                                 <label className="form-label">Username</label>
                              </div>
                              <div className="col-md-6">
                                 <input
                                    type="text"
                                    id="username"
                                    className="form-control"
                                    onChange={this.handleChange}
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="form-group mb-4">
                           <div className="row justify-content-center align-items-center">
                              <div className="col-md-3">
                                 <label className="form-label">Email</label>
                              </div>
                              <div className="col-md-6">
                                 <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    onChange={this.handleChange}
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="form-group mb-4">
                           <div className="row justify-content-center align-items-center">
                              <div className="col-md-3">
                                 <label className="form-label">Purpose</label>
                              </div>
                              <div className="col-md-6">
                                 <textarea
                                    className="form-control"
                                    rows="2"
                                    id="comments"
                                    placeholder="Your Purpose of Using iStream"
                                    onChange={this.handleChange}
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="row justify-content-center">
                           <div className="col-sm-4">
                              <button type="submit" className="green-button">
                                 Register
                              </button>
                           </div>
                        </div>

                        <p className="text-center text-muted mt-3 mb-0">
                           Have already an account?{" "}
                           <a href="/login" className="fw-bold text-body">
                              <u>Login here</u>
                           </a>
                        </p>
                     </form>
                  </div>
               </div>
            </div>
         </main>
      );
   }
}
