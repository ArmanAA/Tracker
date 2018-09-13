import React, { Component } from "react";
import Signup from "../Signup/Signup";
class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h1>Hello</h1>
        <Signup />
      </div>
    );
  }
}

export default Home;
