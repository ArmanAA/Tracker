import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
  }

  onClick = e => {
    e.preventDefault();
    fetch("http://localhost:8080/api/dash/script", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(data => console.log(data.message));
  };
  componentDidMount() {}
  render() {
    return (
      <div>
        <h1>Hello this is my react app</h1>
        <button onClick={this.onClick}>Script Generator</button>
      </div>
    );
  }
}

export default App;
