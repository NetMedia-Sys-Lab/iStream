import React, { Component } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

export default class InformationButton extends Component {
   render() {
      const popoverHover = (
         <Popover className="p-1" id="popover-trigger-hover" title="Popover bottom">
            {this.props.message}
         </Popover>
      );
      return (
         <OverlayTrigger trigger={["hover", "focus"]} placement="bottom" overlay={popoverHover}>
            <button type="button" className="btn btn-info btn-rounded">
               <i className="fa fa-info" aria-hidden="true"></i>
            </button>
         </OverlayTrigger>
      );
   }
}
