import React, { Component } from 'react';
import {Col, Form, FormGroup, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class AbandonModal extends Component {
  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} onToggle={this.props.onToggle} >
            <ModalHeader onToggle={this.props.onToggle}>Abandon Game?</ModalHeader>
            <ModalBody>
                <Form onSubmit={this.props.handleSubmit} >
                    <FormGroup row>
                      <Label>Do you really want to abandon your teammates?</Label>


                    </FormGroup>
                    <FormGroup row>
                      <Button color="success" data-dismiss="modal" onClick={this.props.onToggle}>Cancel</Button>
                      <Button color="danger" data-dismiss="modal" >Abandon Game</Button>
                    </FormGroup>
                </Form>
            </ModalBody>
          </Modal>
      </div>
    );
  }
}

export default AbandonModal;
