import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/Home/Home";
import RegisterWebsite from "./components/RegisterWebsite/RegisterWebsite";
import Login from "./components/Login/Login";
import UserHistory from "./components/UserHistory/UserHistory";

import Report from "./components/Report/Report";
import ScriptGenerator from "./components/ScriptGenerator/ScriptGenerator";
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/getscript/:id" component={RegisterWebsite} />
          <Route exact path="/websites/:id" component={UserHistory} />
          <Route exact path="/tracks/:id/:url" component={ScriptGenerator} />
          <Route exact path="/report/:id/:url" component={Report} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
