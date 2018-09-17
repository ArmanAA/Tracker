import React, { Component } from "react";
import styles from "../../Styles/style.css";
import { Redirect } from "react-router-dom";
import ErrorMessage from "../Modals/ErrorMessage";

var validator = require("validator");
const divStyle = {
  margin: "0 auto",
  width: "50%"
};
class ScriptGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.match.params.id,
      webURL: "",
      message: "",
      script: "",
      readOnly: true,
      redirect: false,
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
            if (res.status === 400) {
              this.setState({ show: true });
              this.setState({ message: "This URL has already been tagged." });
            }
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
      let url = "/history/" + this.state.username;
      return <Redirect to={url} />;
    }
  };

  render() {
    return (
      <div className={styles.BackGroundImageTag}>
        <div>
          <ErrorMessage
            show={this.state.show}
            onClose={this.handleClose}
            message={this.state.message}
          />
        </div>

        <form id={styles["form-style"]}>
          <label className={styles.font} htmlFor="Website URL:">
            Enter URL Here{" "}
          </label>
          <input
            className={styles["signup-input"]}
            name="webURL"
            value={this.state.webURL}
            onChange={e => this.change(e)}
          />
          <br />
        </form>
        <div style={divStyle}>
          <button className={styles.button} onClick={e => this.onSubmit(e)}>
            Register Website
          </button>
          <button
            className={styles.button}
            onClick={e => this.renderHistory(e)}
          >
            View Websites
          </button>
        </div>
        <div style={divStyle}>
          <label className={styles.font} htmlFor="Website URL:">
            Copy Tag Below
          </label>
          <textarea
            className={styles["signup-input"]}
            value={this.state.script}
            readOnly={this.state.readOnly}
          />
        </div>

        {this.renderRedirect()}
      </div>
    );
  }
}

export default ScriptGenerator;
