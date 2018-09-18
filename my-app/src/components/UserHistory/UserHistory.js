import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import moment from "moment";
import styles from "../../Styles/style.css";
import { Redirect } from "react-router-dom";

class UserHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.match.params.id,
      moment: moment(),
      data: [],
      url: "",
      show: false,
      redirect: false
    };
  }

  componentDidMount() {
    var url =
      "http://localhost:8080/api/dash/webtrackhistory/" + this.state.username;

    fetch(url)
      .then(results => results.json())
      .then(results => {
        this.setState({ data: results.message });
      });
  }
  handleChange = moment => {
    this.setState({
      moment
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      let myurl = "/tracks/" + this.state.username + "/" + this.state.url;

      return <Redirect to={myurl} />;
    }
  };

  render() {
    var options = {
      onRowClick: function(row) {
        this.setState({ url: row.Url });
        this.setState({ redirect: true });
      }.bind(this)
    };
    return (
      <div>
        <h1 className={styles.h1Tag}>Tracked Websites</h1>
        <h4 className={styles.h4Tag}>
          Click a row to add paths to your domain or view report.
        </h4>

        <BootstrapTable
          className={"table table-bordered table-hover " + styles.table}
          data={this.state.data}
          options={options}
        >
          <TableHeaderColumn isKey dataField="Url">
            Website
          </TableHeaderColumn>
          <TableHeaderColumn dataField="Count">
            Total Page Views
          </TableHeaderColumn>
        </BootstrapTable>
        {this.renderRedirect()}
        <div />
      </div>
    );
  }
}

export default UserHistory;
