import React, { Component } from "react";
import { Link } from "react-router-dom";
import { createMatcher,loadModels } from "../api/face";
export default class Home extends Component {
  componentDidMount() {
   loadModels();
    setTimeout(() => {
      createMatcher();
    }, 2000);
  }
  render() {
    return (
      <div>
        <h2>BNK48 Facial Recognition App</h2>
        {/* <li>
          <Link to="/photo">Photo Input</Link>
        </li> */}
        <li>
          <Link to="/camera">Video Camera</Link>
        </li>
        {/* <li>
          <Link to="/custom">Custom</Link>
        </li> */}
      </div>
    );
  }
}
