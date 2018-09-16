import React, { Component } from "react";
//import Griddle, { plugins, RowDefinition, ColumnDefinition} from 'griddle-react';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import TimeInterval from "../Modals/TimeInterval";
import Calendar from "react-calendar";

import moment from "moment";
import styles from "../Signup/signup.css";
//import DateTimePicker from "react-datetime-picker";

//import { DatetimePicker } from "rc-datetime-picker";
//const JsonTable = require("ts-react-json-table");

class UserHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.match.params.id,
      moment: moment(),
      data: [],
      date: new Date(),
      url: "",
      show: false
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
  componentDidMount() {
    var url =
      "http://localhost:8080/api/dash/webtrackhistory/" + this.state.username;

    fetch(url)
      .then(results => results.json())
      .then(results => {
        console.log(results);
        this.setState({ data: results.message });
      });
  }

  //   renderHistory = () => {
  //     return (

  //     )
  //   }
  // };
  handleChange = moment => {
    this.setState({
      moment
    });
  };

  showTimeInterval = () => {
    if (this.state.show) {
      return (
        <TimeInterval
          url={this.state.url}
          username={this.state.username}
          show={this.state.show}
          onClose={this.handleClose}
        />
      );
    }
  };
  onChange = date => this.setState({ date });
  render() {
    var options = {
      onRowClick: function(row) {
        this.setState({ url: row.Url });
        this.setState({ show: true });
      }.bind(this)
    };
    return (
      <div>
        <h1>Tracked Webs History {this.state.username}</h1>

        <BootstrapTable
          class="table table-striped"
          data={this.state.data}
          options={options}
        >
          <TableHeaderColumn isKey dataField="Url">
            URL
          </TableHeaderColumn>
          <TableHeaderColumn dataField="Count">Page Views</TableHeaderColumn>
        </BootstrapTable>
        {this.showTimeInterval()}
        <div />
      </div>
    );
  }
}

export default UserHistory;
