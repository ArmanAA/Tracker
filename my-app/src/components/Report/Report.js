import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import TimeInterval from "../Modals/TimeInterval";
import moment from "moment";
import styles from "../../Styles/style.css";
import { Redirect } from "react-router-dom";
import { Link } from "react-router";
class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.match.params.id,
      url: this.props.match.params.url,
      data: [],
      show: false,
      startTime: "",
      endTime: ""
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
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
  handleClose() {
    this.setState({ show: false });
  }
  handleShow() {
    this.setState({ show: true });
  }
  componentDidMount() {
    var url =
      "http://localhost:8080/api/dash/getPathReport/" +
      this.state.username +
      "/" +
      this.state.url;

    fetch(url)
      .then(results => results.json())
      .then(results => {
        this.setState({ data: results.message });
        //  console.log(this.state.data);
      });
  }
  //   showTimeInterval = () => {
  //     if (this.state.show) {
  //       return (
  //         <TimeInterval
  //           url={this.state.url}
  //           username={this.state.username}
  //           show={this.state.show}
  //           onClose={this.handleClose}
  //           data={this.state.data}
  //         />
  //       );
  //     }
  //   };
  onSubmit = e => {
    e.preventDefault();

    fetch("http://localhost:8080/api/dash/tracktimeinterval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    })
      .then(results => results.json())
      .then(results => {
        console.log(results.message);
        this.setState({ data: results.message });
      });
  };
  showScript = e => {
    e.preventDefault();
    this.setState({ show: true });
  };
  render() {
    return (
      <div>
        <h1 className={styles.h1Tag}>Report</h1>

        <BootstrapTable
          className={"table table-bordered table-hover " + styles.table}
          data={this.state.data}
        >
          <TableHeaderColumn isKey dataField="Url">
            URL's
          </TableHeaderColumn>
          <TableHeaderColumn dataField="Count">Page Views</TableHeaderColumn>
        </BootstrapTable>

        <div />
        <div className={styles.center}>
          {" "}
          <button
            className={styles.buttonCenter}
            onClick={e => this.showScript(e)}
          >
            Select Time Interval
          </button>
          {this.state.show ? (
            <TimeInterval
              url={this.state.url}
              username={this.state.username}
              show={this.state.show}
              onClose={this.handleClose}
              data={this.state.data}
              onSubmit={e => this.onSubmit(e)}
              handleStartDate={this.handleStartDate}
              handleEndDate={this.handleEndDate}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Report;
