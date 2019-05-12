import React, { Component } from 'react';
import { Input, Form, FormGroup, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../styles/ConfirmModal.css';

class CreateNameModal extends Component {


  render() {

    let warningOpen = this.props.warningOpen;
    var warningLabel;

    if (warningOpen) {
      warningLabel = <div class="ui negative message">
                        <i class="close icon" onClick={this.props.onWarningClose}></i>
                        <div class="header">
                          Name must be larger than 2 characters and must only contain letters and/or numbers OR the name has already been taken!
                        </div>
                      </div>
    }

    return (
      <div>
        <Modal isOpen={this.props.isOpen} onToggle={this.props.onToggle}>
          <ModalHeader onToggle={this.props.onToggle}>
            Create a Player Name
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.props.handleSubmit}>
              {warningLabel}
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
