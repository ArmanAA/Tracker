import React, { Component } from "react";
import styles from "../Signup/signup.css";
import { Redirect } from "react-router-dom";
import ErrorMessage from "../Modals/ErrorMessage";

var validator = require("validator");

class ScriptGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   id: this.props.match.params.id,
      username: this.props.match.params.id,
      webURL: "",
      readOnly: true,
      script: "",
      redirect: false,
      message: "",
      show: false
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  change = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    if (this.state.webURL !== "") {
      fetch("http://localhost:8080/api/dash/registerwebsite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({
          username: this.state.username,
          url: this.state.webURL
        })
      })
        .then(res => {
          if (!res.ok) {
          } else {
            res.json().then(json => {
              this.setState({ script: json.message });
              console.log(json);
            });
          }
        })

        .catch(error => console.log(error));
    } else {
      this.setState({ show: true });
      this.setState({
        message: "Please enter the URL you would like to track. "
      });
    }
  };
  handleClose() {
    this.setState({ show: false });
  }
  handleShow() {
    this.setState({ show: true });
  }
  renderHistory = e => {
    e.preventDefault();
    this.setRedirect();
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      //var username = this.state.username.slice(1)
      let url = "/history/" + this.state.username;
      return <Redirect to={url} />;
    }
  };
  componentDidMount() {
    //   this.setState({script:""})
    //   this.setState({webURL:""})
  }
  render() {
    // let url = new URL(window.location.href);
    // let params = new URLSearchParams(url.search.slice(1));
    return (
      <div>
        <div>
          <ErrorMessage
            show={this.state.show}
            onClose={this.handleClose}
            message={this.state.message}
          />
        </div>
        <h1> ScriptGenerator for {this.state.username}</h1>

        <form id={styles["form-style"]}>
          <label htmlFor="Website URL:">
            Please enter the website URL you want to tag{" "}
          </label>
          <input
            className={styles["signup-input"]}
            name="webURL"
            placeholder="Website URL"
            value={this.state.webURL}
            onChange={e => this.change(e)}
          />
          <br />
        </form>
        <div className={styles.simple}>
          <button onClick={e => this.onSubmit(e)}>Register Website</button>
          <button onClick={e => this.renderHistory(e)}>
            View Your Tracked Websites
          </button>
        </div>

        {this.renderRedirect()}
        <div className={styles.simple}>
          <textarea value={this.state.script} readOnly={this.state.readOnly} />
        </div>
      </div>
    );
  }
}

export default ScriptGenerator;
