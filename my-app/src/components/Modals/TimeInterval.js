import React from "react";
import Modal from "react-responsive-modal";
import Datetime from "react-datetime";
import styles from "../Signup/signup.css";
import moment from "moment";

const divStyle = {
  fontFamily: "sans-serif",
  textAlign: "center",
  width: "1000px"
};

class TimeInterval extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.show,
      startTime: "",
      endTime: "",
      username: props.username,
      url: props.url,
      pageViewCount: "",
      show: false
    };
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ show: false });
    this.setState({ open: false });
  };
  componentWillUpdate() {}
  handleStartDate = date => {
    if (moment.isMoment(date)) {
      this.setState({ startTime: date.format() });
    }

    //alert(this.state.startDate);
  };
  handleEndDate = date => {
    // alert("in end date");
    if (moment.isMoment(date)) {
      this.setState({ endTime: date.format() });
    }

    //alert(this.state.startDate);
  };
  showPageViews = () => {
    if (this.state.show) {
      return (
        <p>
          {" "}
          The Pageviews for {this.state.url} from {this.state.startTime}
          to {this.state.endTime} is {this.state.pageViewCount}
        </p>
      );
    }
  };
  onSubmit = e => {
    e.preventDefault();
    console.log(this.state.startTime);
    console.log(this.state.endTime);
    fetch("http://localhost:8080/api/dash/tracktimeinterval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 406) {
            console.log("Failure: ", JSON.stringify(res.status));
          }
          console.log("Failure: ", JSON.stringify(res.status));
        } else {
          res.json().then(json => {
            this.setState({ pageViewCount: json.count });
            console.log(json);
            this.setState({ show: true });
          });
        }
      })

      .catch(error => console.log(error));
  };
  render() {
    return (
      <div styles={divStyle}>
        <Modal
          open={this.props.show}
          onClose={this.props.onClose}
          message={this.props.message}
          center
        >
          <label>Start Time</label>
          <Datetime onChange={this.handleStartDate} />
          <br />
          <label>End Time</label>
          <Datetime onChange={this.handleEndDate} />
          <br />
          <button onClick={e => this.onSubmit(e)}>Submit</button>
          {this.showPageViews()}
        </Modal>
      </div>
    );
  }
}

export default TimeInterval;
