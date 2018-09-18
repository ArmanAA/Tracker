import React, { Component } from "react";
import styles from "../../Styles/style.css";
import { Redirect } from "react-router-dom";
import ErrorMessage from "../Modals/ErrorMessage";
const divStyle = {
  margin: "0 auto",
  width: "50%"
};
class ScriptGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.match.params.id,
      url: this.props.match.params.url,
      message: "",
      readOnly: true,
      show: false,
      redirect: false,
      script: "",
      pathName: "",
      toggle: false,
      buttonName: "Script",
      paths: []
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.Toggle = this.Toggle.bind(this);
  }
  Toggle() {
    this.setState({ toggle: !this.state.toggle });
    if (!this.state.toggle) {
      this.setState({ buttonName: "Close Script" });
    } else {
      this.setState({ buttonName: "Script" });
    }
  }
  handleClose() {
    this.setState({ show: false });
  }
  handleShow() {
    this.setState({ show: true });
  }
  componentDidMount() {
    let url =
      "http://localhost:8080/api/dash/getScript/" +
      this.state.username +
      "/" +
      this.state.url;

    fetch(url)
      .then(res => {
        if (!res.ok) {
          if (res.status === 400) {
            this.setState({
              message: "This website is not registered."
            });
            this.setState({ show: true });
          } else if (res.status === 406) {
            this.setState({ show: true });
            this.setState({
              message: "Username does not exist."
            });
          }
        } else {
          res.json().then(json => {
            this.setState({ script: json.message });
          });
        }
      })

      .catch(error => console.log(error));
  }
  change = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  renderHistory = e => {
    e.preventDefault();
    this.setRedirect();
  };
  showScript = e => {
    e.preventDefault();
    this.Toggle();
    this.setState({
      message: this.state.script
    });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      let url = "/report/" + this.state.username + "/" + this.state.url;
      return <Redirect to={url} />;
    }
  };
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  onSubmit = e => {
    e.preventDefault();
    if (this.state.pathName !== "") {
      fetch("http://localhost:8080/api/dash/addPathTrack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({
          username: this.state.username,
          url: this.state.url,
          path: this.state.pathName
        })
      })
        .then(res => {
          if (!res.ok) {
            if (res.status === 406) {
              this.setState({ show: true });
              this.setState({
                message: "This path has already been tagged."
              });
            }
          } else {
            res.json().then(json => {
              this.setState({ show: true });
              this.setState({
                message: "Path tagged."
              });
            });
          }
        })

        .catch(error => console.log(error));
    } else {
      this.setState({ show: true });
      this.setState({
        message: "Please enter a path to track."
      });
    }
  };
  render() {
    return (
      <div>
        <h1>
          In TrackHistory for user: {this.state.username} and url:{" "}
          {this.state.url}{" "}
        </h1>
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
            placeholder="Domain name..."
            name="pathName"
            value={this.state.webURL}
            onChange={e => this.change(e)}
          />
          <br />
        </form>
        <div style={divStyle}>
          <button className={styles.button} onClick={e => this.onSubmit(e)}>
            Tag Path
          </button>
          <button
            className={styles.button}
            onClick={e => this.renderHistory(e)}
          >
            View Report
          </button>
          <button className={styles.button} onClick={e => this.showScript(e)}>
            {this.state.buttonName}
          </button>
          {this.state.toggle ? (
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
          ) : null}
        </div>
        {this.renderRedirect()}
      </div>
    );
  }
}

export default ScriptGenerator;
