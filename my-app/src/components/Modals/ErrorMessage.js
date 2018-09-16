import React from "react";
import Modal from "react-responsive-modal";

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
    //this.componentWillUpdate();
  };
  componentWillUpdate() {}
  render() {
    return (
      <div>
        <Modal
          open={this.props.show}
          onClose={this.props.onClose}
          message={this.props.message}
          center
        >
          <h2>{this.props.message}</h2>
        </Modal>
      </div>
    );
  }
}

export default ErrorMessage;
