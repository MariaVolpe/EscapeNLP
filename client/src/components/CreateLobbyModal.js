import React, { Component } from 'react';
import { Input, Form, FormGroup, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../styles/ConfirmModal.css';

class CreateLobbyModal extends Component {
  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} onToggle={this.props.onToggle}>
          <ModalHeader onToggle={this.props.onToggle}>
            Create a Lobby
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.props.handleSubmit}>
              <FormGroup row>
                <div clasName="col-3" >
                  Lobby Name:
                </div>
                <Input className="col-8 centered" />
              </FormGroup>
              <FormGroup row>
                <div clasName="col-3" >
                  Password:
                </div>
                <Input className="col-8 centered" />
              </FormGroup>
              <FormGroup row>
                <Button
                  color="danger"
                  data-dismiss="modal"
                  className="centered"
                  onClick={this.props.onToggle}
                >
                  Cancel
                </Button>
                <Button
                  color="success"
                  data-dismiss="modal"
                  className="centered"
                >
                  Create
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default CreateLobbyModal;
