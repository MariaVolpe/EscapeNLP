import React, { Component } from 'react';
import {Col, Form, FormGroup, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './ConfirmModal.css';

class ConfirmModal extends Component {
  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} onToggle={this.props.onToggle} >
            <ModalHeader onToggle={this.props.onToggle}>{this.props.confirmInfo.title}</ModalHeader>
            <ModalBody>
                <Form onSubmit={this.props.handleSubmit} >
                    <FormGroup row>
                      <Label className="centered">{this.props.confirmInfo.text}</Label>


                    </FormGroup>
                    <FormGroup row>
                      <Button color="success" data-dismiss="modal" className="centered" onClick={this.props.onToggle}>{this.props.confirmInfo.cancel}</Button>
                      <Button color="danger" data-dismiss="modal" className="centered" >{this.props.confirmInfo.confirm}</Button>
                    </FormGroup>
                </Form>
            </ModalBody>
          </Modal>
      </div>
    );
  }
}

export default ConfirmModal;
