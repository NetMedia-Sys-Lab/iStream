import React, { Component } from "react";

export default class Header extends Component {
   logout = () => {
      localStorage.removeItem("user");
      window.location.assign("login");
   };

   render() {
      return (
         <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
               <span className="navbar-brand mb-0 ms-1 h1">iStream</span>

               <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">
                     <li className="nav-item active">
                        <a className="nav-link" href="/home">
                           Home
                        </a>
                     </li>
                     <li className="nav-item">
                        <a className="nav-link" href="/machines">
                           Machines
                        </a>
                     </li>
                     <li className="nav-item">
                        <a className="nav-link" href="/setting">
                           Setting
                        </a>
                     </li>

                     <li className="nav-item">
                        <a className="nav-link" href="/login" onClick={this.logout}>
                           Logout
                        </a>
                     </li>
                  </ul>
               </div>
            </div>
         </nav>
      );
   }
}
