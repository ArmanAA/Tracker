import React from "react";
import Modal from "react-responsive-modal";
import Datetime from "react-datetime";
import styles from "../../Styles/style.css";
import moment from "moment";
import Report from "../Report/Report";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
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
      message: "",
      data: props.data,
      newData: [],
      redirect: false
    };
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  componentWillUpdate() {}
  handleStartDate = date => {
    if (moment.isMoment(date)) {
      this.setState({ startTime: date.format() });
    }
  };
  handleEndDate = date => {
    if (moment.isMoment(date)) {
      this.setState({ endTime: date.format() });
    }
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

          <Datetime onChange={this.props.handleStartDate} />
          <br />
          <label>End Time</label>
          <Datetime onChange={this.props.handleEndDate} />
          <br />
          <button className={styles.button} onClick={this.props.onSubmit}>
            Submit
          </button>
        </Modal>
      </div>
    );
  }
}

export default TimeInterval;
