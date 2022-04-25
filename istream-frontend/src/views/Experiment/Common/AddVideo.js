import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { AddNewVideo } from "src/api/ModulesAPI";
import { toast } from "react-toastify";

export default class AddVideo extends Component {
   state = {
      user: JSON.parse(localStorage.getItem("user")),
      videoFile: null,
      frameRate: 0,
      codec: "",
      resolution: 0,
      bitRate: 0,
   };

   handleSubmit = (event) => {
      event.preventDefault();

      var newVideoData = new FormData();
      newVideoData.append("userId", this.state.user.userId);
      newVideoData.append("username", this.state.user.username);
      newVideoData.append("componentName", this.props.componentName);
      newVideoData.append("resolution", this.state.resolution);
      newVideoData.append("frameRate", this.state.frameRate);
      newVideoData.append("codec", this.state.codec);
      newVideoData.append("bitRate", this.state.bitRate);
      newVideoData.append("video", this.state.videoFile);

      AddNewVideo(newVideoData).then((res) => {
         this.props.updateData();
         toast.success(res);
         this.props.toggleDisplay();
      });
   };

   render() {
      return (
         <div>
            <Modal show={this.props.display}>
               <Modal.Header>
                  <Modal.Title>Upload New Video</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <form onSubmit={this.handleSubmit}>
                     <div className="form-group row">
                        <label className="col-6 col-form-label">Resolution:(required)</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="text"
                              placeholder="Not determined"
                              onChange={(event) => {
                                 this.setState({ resolution: event.target.value });
                              }}
                              required
                           />
                        </div>
                     </div>

                     <div className="form-group row mt-2">
                        <label className="col-6 col-form-label">Frame rate:</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              placeholder="Not determined"
                              type="text"
                              onChange={(event) => {
                                 this.setState({ frameRate: event.target.value });
                              }}
                           />
                        </div>
                     </div>
                     <div className="form-group row mt-2">
                        <label className="col-6 col-form-label">Codec:</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="text"
                              placeholder="Not determined"
                              onChange={(event) => {
                                 this.setState({ codec: event.target.value });
                              }}
                           />
                        </div>
                     </div>
                     <div className="form-group row mt-2">
                        <label className="col-6 col-form-label">Bit Rate:</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="text"
                              placeholder="Not determined"
                              onChange={(event) => {
                                 this.setState({ bitRate: event.target.value });
                              }}
                           />
                        </div>
                     </div>
                     <div className="form-group row mt-2">
                        <label className="col-6 col-form-label">Upload Video</label>
                        <div className="col-6">
                           <input
                              className="form-control"
                              type="file"
                              id="videoFile"
                              name="videoFile"
                              onChange={(event) =>
                                 this.setState({ videoFile: event.target.files[0] })
                              }
                              required
                              multiple
                           />
                        </div>
                     </div>
                     <hr />
                     <div className="mt-3">
                        <Button onClick={this.props.toggleDisplay} variant="danger">
                           Cancel
                        </Button>
                        <Button className="float-end" type="submit">
                           Upload
                        </Button>
                     </div>
                  </form>
               </Modal.Body>
            </Modal>
         </div>
      );
   }
}
