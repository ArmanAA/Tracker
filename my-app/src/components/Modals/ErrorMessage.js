import React from "react";
import Modal from "react-responsive-modal";
import styles from "../../Styles/style.css";
class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.show
    };
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };
  componentWillUpdate() {}
  render() {
    return (
      <div>
        <Modal
          styles={this.props.styles}
          open={this.props.show}
          onClose={this.props.onClose}
          message={this.props.message}
          center
        >
          <h2 className={styles.h1}>{this.props.message}</h2>
        </Modal>
      </div>
    );
  }
}

export default ErrorMessage;
