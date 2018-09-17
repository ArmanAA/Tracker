import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/Home/Home";
import ScriptGenerator from "./components/ScriptGenerator/ScriptGenerator";
import Login from "./components/Login/Login";
import UserHistory from "./components/UserHistory/UserHistory";
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/getscript/:id" component={ScriptGenerator} />
          <Route exact path="/history/:id" component={UserHistory} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
