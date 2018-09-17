import React from "react";
import Modal from "react-responsive-modal";
import Datetime from "react-datetime";
import styles from "../../Styles/style.css";
import ErrorMessage from "./ErrorMessage";
//import styles from "../../Styles/style.css";
import moment from "moment";
const modalStyle = {
  modal: {
    width: "60%"
  }
};
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
      show: false,
      showMessage: false,
      message: ""
    };
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };
  onOpenMessageModal = () => {
    this.setState({ showMessage: true });
  };

  onCloseMessageModal = () => {
    this.setState({ showMessage: false });
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
  renderMessage = () => {
    if (this.state.showMessage) {
      return (
        <ErrorMessage
          styles={modalStyle}
          show={this.state.showMessage}
          onClose={this.onCloseMessageModal}
          message={this.state.message}
        />
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
            this.setState({
              message:
                this.state.pageViewCount +
                " Pageview for " +
                this.state.url +
                " during that time."
            });
            this.setState({ showMessage: true });
          });
        }
      })

      .catch(error => console.log(error));
  };
  render() {
    return (
      <div styles={divStyle}>
        <Modal
          styles={modalStyle}
          open={this.props.show}
          onClose={this.props.onClose}
          message={this.props.message}
          center
        >
          <label>Start Time</label>
          {/* <input
            type="date"
            id="start"
            name="trip"
            value="2018-07-22"
            min="2018-01-01"
            max="2018-12-31"
          /> */}
          <Datetime onChange={this.handleStartDate} />
          <br />
          <label>End Time</label>
          <Datetime onChange={this.handleEndDate} />
          <br />
          <button className={styles.button} onClick={e => this.onSubmit(e)}>
            Submit
          </button>
          {this.renderMessage()}
        </Modal>
      </div>
    );
  }
}

export default TimeInterval;
