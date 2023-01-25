import React, { Component } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

export default class InformationButton extends Component {
   render() {
      const renderTooltip = (props) => (
         <Tooltip id="button-tooltip" {...props}>
            {this.props.message}
         </Tooltip>
      );

      return (
         <OverlayTrigger
            placement={this.props.placement ? this.props.placement : "bottom"}
            delay={{ show: 0, hide: 400 }}
            overlay={renderTooltip}
         >
            <Button className="button-block" variant="info">
               <i className="fa fa-info" aria-hidden="true"></i>
            </Button>
         </OverlayTrigger>
      );
   }
}
