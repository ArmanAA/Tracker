import React, { Component } from "react";
import styles from "../../Styles/style.css";
import ErrorMessage from "../Modals/ErrorMessage";
import { Redirect } from "react-router-dom";

const DIVSTYLE = {
  textAlign: "center",
  fontWeight: "bold",
  fontSize: 30,
  color: "blue"
};
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      redirect: false,
      show: false,
      message: "",
      id: ""
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ show: false });
  }
  handleShow() {
    this.setState({ show: true });
  }

  change = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  showError = () => {
    if (this.state.show) {
      return (
        <ErrorMessage
          color="danger"
          show={this.state.show}
          onClose={this.handleClose}
          message={this.state.message}
        />
      );
    }
  };
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      let url = "/getscript/" + this.state.username;
      return <Redirect to={url} />;
    }
  };
  onSubmit = e => {
    e.preventDefault();
    fetch("http://localhost:8080/api/dash/login", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      credentials: "same-origin",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(res => {
        if (!res.ok) {
          this.setState({ message: "Login credientials were not found" });
          this.setState({ show: true });
        } else {
          res.json().then(json => {
            this.setState({ username: json.username });
            this.setRedirect();
          });
        }
      })

      .catch(error => console.log(error));
  };
  render() {
    return (
      <div className={styles.BackGroundImageLogin}>
        <form id={styles["form-style"]}>
          <label className={styles.font} htmlFor="Username:">
            Username
          </label>
          <input
            className={styles["signup-input"]}
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={e => this.change(e)}
          />
          <br />
          <label className={styles.font} htmlFor="Password:">
            Password
          </label>
          <input
            className={styles["signup-input"]}
            name="password"
            placeholder="Password"
            value={this.state.password}
            type="password"
            onChange={e => this.change(e)}
          />
        </form>
        <div style={DIVSTYLE}>
          <button className={styles.button} onClick={e => this.onSubmit(e)}>
            Login
          </button>
        </div>
        {this.showError()}
        {this.renderRedirect()}
      </div>
    );
  }
}

export default Login;
