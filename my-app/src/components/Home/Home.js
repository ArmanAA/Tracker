import React, { Component } from "react";
import Signup from "../Signup/Signup";
import styles from "../../Styles/style.css";

class Home extends Component {
  render() {
    return (
      <div className={styles.BackGroundImageHome}>
        <div className={styles.center}>
          <header>
            <h1 className={styles.h1Tag}> Welcome To Tracker!</h1>
          </header>

          <Signup />
        </div>
      </div>
    );
  }
}

export default Home;
