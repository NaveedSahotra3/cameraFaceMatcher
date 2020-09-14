import Axios from "axios";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Webcam from "react-webcam";
import {
  loadModels,
  getFullFaceDescription,
  createMatcher,
  getMatcher,
} from "../api/face";
// Import face profile
const JSON_PROFILE = require("../descriptors/bnk48.json");

const WIDTH = 600;
const HEIGHT = 600;
const inputSize = 160;

class VideoInput extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      fullDesc: null,
      detections: null,
      descriptors: null,
      faceMatcher: null,
      match: null,
      facingMode: null,
      axiosRuns: false,
    };
  }

  componentWillMount = async () => {
    // await loadModels();

    this.setState({ faceMatcher: await getMatcher(JSON_PROFILE) });
    this.setInputDevice();
  };

  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      let inputDevice = await devices.filter(
        (device) => device.kind === "videoinput"
      );
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: "user",
        });
      } else {
        await this.setState({
          facingMode: { exact: "environment" },
        });
      }
      this.startCapture();
    });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 1500);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  capture = async () => {
    if (!!this.webcam.current) {
      await getFullFaceDescription(
        this.webcam.current.getScreenshot(),
        inputSize
      ).then((fullDesc) => {
        if (!!fullDesc) {
          this.setState({
            detections: fullDesc.map((fd) => fd.detection),
            descriptors: fullDesc.map((fd) => fd.descriptor),
          });
        }
      });

      if (!!this.state.descriptors && !!this.state.faceMatcher) {
        let match = await this.state.descriptors.map((descriptor) =>
          this.state.faceMatcher.findBestMatch(descriptor)
        );
        this.setState({ match });
      }
    }
  };
  indexOfValue = 1;
  userName = "";
  render() {
    const { detections, match, facingMode } = this.state;
    let videoConstraints = null;
    let camera = "";
    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode,
      };
      if (facingMode === "user") {
        camera = "Front";
      } else {
        camera = "Back";
      }
    }

    let drawBox = null;
    if (!!detections) {
      drawBox = detections.map((detection, i) => {
        let _H = detection.box.height;
        let _W = detection.box.width;
        let _X = detection.box._x;
        let _Y = detection.box._y;
        if (match) {
          console.log(match);
          if (match.length > 0) {
            if (match[0]._label !== "unknown") {
              
              if(this.userName !== match[i]._label.split(" ")[0]){
                this.indexOfValue = 1
              }
              if (this.indexOfValue === 1) {
                this.indexOfValue++;

                let id = match[0]._label.slice(
                  match[0]._label.indexOf(" "),
                  match[0]._label.length
                );

                Axios.post("http://localhost:8080/attendance_mark/today", {
                  _id: id,
                }).then((res) => {
                  alert(res.data);
                });
                this.userName = match[i]._label.split(" ")[0]
              }
            }
          }
        }
        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                border: "solid",
                borderColor: "blue",
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`,
              }}
            >
              {!!match && !!match[i] ? (
                <p
                  style={{
                    backgroundColor: "blue",
                    border: "solid",
                    borderColor: "blue",
                    width: _W,
                    marginTop: 0,
                    color: "#fff",
                    transform: `translate(-3px,${_H}px)`,
                  }}
                >
                  {match[i]._label.split(" ")[0]}
                </p>
              ) : null}
            </div>
          </div>
        );
      });
    }

    return (
      <div
        className="Camera"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>Camera: {camera}</p>
        <div
          style={{
            width: WIDTH,
            height: HEIGHT,
          }}
        >
          <div style={{ position: "relative", width: WIDTH }}>
            {!!videoConstraints ? (
              <div style={{ position: "absolute" }}>
                <Webcam
                  audio={false}
                  width={WIDTH}
                  height={HEIGHT}
                  ref={this.webcam}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              </div>
            ) : null}
            {!!drawBox ? drawBox : null}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(VideoInput);
