import React, { Component } from "react";

class Signup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form id={styles["form-style"]}>
        <label htmlFor="Username:">First Name</label>
        <input
          className={styles["signup-input"]}
          name="firstName"
          placeholder="First Name"
          value={this.state.firstName}
          onChange={e => this.change(e)}
        />
        <br />
        <label htmlFor="Username:">Last Name</label>
        <input
          className={styles["signup-input"]}
          name="lastName"
          placeholder="Last Name"
          value={this.state.lastName}
          onChange={e => this.change(e)}
        />
        <br />
        <label htmlFor="Username:">Email Address</label>
        <input
          className={styles["signup-input"]}
          name="email"
          placeholder="Your Email"
          value={this.state.email}
          onChange={e => this.change(e)}
        />
        <br />
        <label htmlFor="Username:">Phone Number</label>
        <input
          className={styles["signup-input"]}
          name="phoneNum"
          placeholder="Your Phone Number"
          value={this.state.phoneNum}
          onChange={e => this.change(e)}
        />
        <br />
        <div style={divStyle}>
          <label htmlFor="Username:">Username</label>
          <input
            className={styles["signup-input"]}
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={e => this.change(e)}
          />
        </div>

        <br />
        <label htmlFor="Username:">Password</label>
        <input
          className={styles["signup-input"]}
          name="password"
          placeholder="Password"
          type="password"
          value={this.state.password}
          onChange={e => this.change(e)}
        />
        <br />
        <label htmlFor="Username:">Re-password</label>
        <input
          className={styles["signup-input"]}
          name="repassword"
          placeholder="Repeat Your Password"
          type="password"
          value={this.state.repassword}
          onChange={e => this.change(e)}
        />
        <br />
        <button id={styles["button-style"]} onClick={e => this.onSubmit(e)}>
          Register
        </button>
      </form>
    );
  }
}
export default Signup;
