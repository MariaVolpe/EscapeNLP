import React, { Component } from 'react';
import { Input, Form, FormGroup, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../styles/ConfirmModal.css';

class CreateNameModal extends Component {
  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} onToggle={this.props.onToggle}>
          <ModalHeader onToggle={this.props.onToggle}>
            Create a Player Name
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.props.handleSubmit}>
              <FormGroup className="left-side" row/>
              <FormGroup className="name-input" row>
                <Input
                  value={this.props.value}
                  onChange={this.props.onNameChange}
                  placeholder="Type in a screenname"
                />
              </FormGroup>
              <FormGroup row>
                <Button
                  color="success"
                  data-dismiss="modal"
                  className="centered"
                >
                  Ok
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default CreateNameModal;
