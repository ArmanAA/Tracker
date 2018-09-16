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

// onClick = e => {
//   e.preventDefault();
//   fetch("http://localhost:8080/api/dash/script", {
//     method: "GET",
//     headers: { "Content-Type": "application/json" }
//   })
//     .then(res => res.json())
//     .then(data => console.log(data.message));
// };
// componentDidMount() {}
// render() {
//   return (
//     <div>
//       <h1>Hello this is my react app</h1>
//       <button onClick={this.onClick}>Script Generator</button>
//     </div>
//   );
// }
