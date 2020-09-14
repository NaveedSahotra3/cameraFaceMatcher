import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import './App.css';

import Home from './views/Home';
import ImageInput from './views/ImageInput';
import VideoInput from './views/VideoInput';
// import Custom from "./custom/custome"

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={createHistory({ basename: process.env.PUBLIC_URL })}>
          <div className="route">
            <Route exact path="/" component={Home} />
            <Route exact path="/photo" component={ImageInput} />
            <Route exact path="/camera" component={VideoInput} />
            {/* <Route exact path="/custom" component={Custom} /> */}
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
