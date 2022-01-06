import React, { Component } from "react";

export default class Login extends Component {
   constructor(props) {
      super(props);
      console.log("here");
      // var token = localStorage.getItem("token");
   }

   render() {
      // const userSelection = this.state.data.length <=0 ? <div>There are No users registered for IStream.</div> :
      // <form onSubmit={this.handleSubmit}>
      // <div className="form-group">
      // <label htmlFor="users">Select a user:</label>
      // <select className="custom-select" name="users" id="users" onChange={this.handleChange}>
      // 	{
      // 		this.state.data.map((user)=>{
      // 			return <option key={user.userId} value={user.userId}>{user.userName}</option>
      // 		})
      // 	}
      // </select>
      // <div className="my-4">
      // <button className="btn btn-primary" type="submit" onSubmit={this.handleSubmit}>Login</button>
      // </div>

      // </div>
      // </form>
      return (
         <main>
            <div className="container h-100">
               <div className="row justify-content-center align-items-center main-height">
                  <div className="col-md-8">
                     <form className="center-container" onSubmit={this.login}>
                        <h1 className="center-text">Welcome to iStream</h1>
                        <hr />
                        <div className="row justify-content-center">
                           <div className="col-md-9">
                              <label>
                                 <b> Username </b>
                              </label>
                           </div>
                        </div>

                        <div className="row justify-content-center">
                           <div className="col-sm-4">
                              <button type="submit" className="green-button">
                                 Login
                              </button>
                           </div>
                        </div>
                        <p className="text-center text-muted mt-3 mb-0">
                           New User?{" "}
                           <a href="/register" className="fw-bold text-body">
                              <u>Register Now</u>
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
