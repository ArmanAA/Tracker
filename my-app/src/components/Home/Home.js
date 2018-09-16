import React, { Component } from "react";
import Signup from "../Signup/Signup";

const divStyle = {
  textAlign: "center",
  color: "blue"
};
class Home extends Component {
  render() {
    return (
      <div>
        <div style={divStyle}>
          <h1>Welcome To Tracker!</h1>
        </div>

        <Signup />
      </div>
    );
  }
}

export default Home;
