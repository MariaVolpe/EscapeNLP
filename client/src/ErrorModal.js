import React, { Component } from 'react';
import {Col, Form, FormGroup, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './ConfirmModal.css';

class ErrorModal extends Component {
  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} onToggle={this.props.onToggle} >
            <ModalHeader onToggle={this.props.onToggle}>Full Lobby</ModalHeader>
            <ModalBody>
                <Form onSubmit={this.props.handleSubmit} >
                    <FormGroup row>
                      <Label className="centered">Unable to join the lobby</Label>


                    </FormGroup>
                    <FormGroup row>
                      <Button color="danger" data-dismiss="modal" className="centered" >OK</Button>
                    </FormGroup>
                </Form>
            </ModalBody>
          </Modal>
      </div>
    );
  }
}

export default ErrorModal;
