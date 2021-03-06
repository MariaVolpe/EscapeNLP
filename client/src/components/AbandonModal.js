import React, { Component } from 'react';
import { Form, FormGroup, Label, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../styles/AbandonModal.css';

class AbandonModal extends Component {
  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} onToggle={this.props.onToggle}>
          <ModalHeader onToggle={this.props.onToggle}>
            Abandon Game?
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.props.handleSubmit}>
              <FormGroup row>
                <Label className="centered">
                  Do you really want to abandon your teammates?
                </Label>
              </FormGroup>
              <FormGroup row>
                <Button
                  color="success"
                  data-dismiss="modal"
                  className="centered"
                  onClick={this.props.onToggle}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  data-dismiss="modal"
                  className="centered"
                >
                  Abandon Game
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default AbandonModal;
