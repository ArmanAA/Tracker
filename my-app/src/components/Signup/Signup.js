import React, { Component } from "react";
import styles from "../../Styles/style.css";
import ErrorMessage from "../Modals/ErrorMessage";
import { Redirect } from "react-router-dom";

var validator = require("validator");

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      repassword: "",
      message: "",
      show: false,
      redirect: false
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
  };
  handleClose() {
    this.setState({ show: false });
  }
  handleShow() {
    this.setState({ show: true });
  }
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  checkInputFields = () => {
    if (
      this.state.password !== "" &&
      this.state.username !== "" &&
      this.state.email !== "" &&
      this.state.repassword !== ""
    ) {
      //check if email is ok!
      if (!validator.isEmail(this.state.email)) {
        this.setState({ message: "Please enter a valid email address." });
        this.handleShow();
        return false;
      } else if (this.state.password !== this.state.repassword) {
        this.setState({
          message: "Your password and confirmation password do not match."
        });
        this.handleShow();
        return false;
      }
    } else {
      this.setState({
        message: "Please complete all fields shown on the sign up form. "
      });
      this.handleShow();
      return false;
    }
    return true;
  };
  toLogin = e => {
    e.preventDefault();
    this.setRedirect();
  };
  onSubmit = e => {
    e.preventDefault();

    if (this.checkInputFields()) {
      fetch("http://localhost:8080/api/dash/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state)
      })
        .then(res => {
          if (!res.ok) {
            if (res.status === 406) {
              this.setState({
                message: "The user name you have entered is already in use."
              });
              this.setState({ show: true });
            }
          } else {
            this.setRedirect();
          }
        })

        .catch(error => console.log(error));
    }
  };
  render() {
    return (
      <div>
        <div>
          <ErrorMessage
            show={this.state.show}
            onClose={this.handleClose}
            message={this.state.message}
          />
        </div>

        <form id={styles["form-style"]}>
          <label htmlFor="Username:">Username</label>
          <input
            className={styles["signup-input"]}
            name="username"
            placeholder="Username"
            value={this.state.firstName}
            onChange={e => this.change(e)}
          />
          <br />
          <label htmlFor="Email:">Email-Address</label>
          <input
            className={styles["signup-input"]}
            name="email"
            placeholder="Your Email"
            value={this.state.lastName}
            onChange={e => this.change(e)}
          />
          <br />
          <label htmlFor="Password:">Password</label>
          <input
            className={styles["signup-input"]}
            name="password"
            placeholder="Password"
            type="password"
            value={this.state.password}
            onChange={e => this.change(e)}
          />
          <br />
          <label htmlFor="Repassword:">Re-password</label>
          <input
            className={styles["signup-input"]}
            name="repassword"
            placeholder="Repeat Your Password"
            type="password"
            value={this.state.repassword}
            onChange={e => this.change(e)}
          />
          <br />
          {this.renderRedirect()}

          <button className={styles.buttonHome} onClick={e => this.toLogin(e)}>
            Log In
          </button>
          <button className={styles.buttonHome} onClick={e => this.onSubmit(e)}>
            Register
          </button>
        </form>
      </div>
    );
  }
}
export default Signup;
