import React, { Component } from 'react';
import { Form, FormGroup, Label, Modal, ModalHeader, ModalBody, Col } from 'reactstrap';
import '../styles/ConfirmModal.css';

class ReportModal extends Component {
  render() {
    if (this.props.message.type === 'interpreted') {
      return (
        <div>
          <Modal isOpen={this.props.isOpen} onToggle={this.props.onToggle}>
            <ModalHeader onToggle={this.props.onToggle} className="centered">
              Report a Wrong Action
            </ModalHeader>
            <ModalBody>
              <Form >
                <FormGroup row>
                  <Label className="centered">
                    {'Is ' + this.props.message.mess + ' the wrong action?'}
                  </Label>
                </FormGroup>
                <FormGroup row>
                  <Col>
                    <button
                      className="ui button"
                      onClick={this.props.onToggle}
                    >
                      Yes
                    </button>
                  </Col>
                  <Col>
                    <button
                      className="ui button"
                      onClick={this.props.onToggle}
                    >
                      No
                    </button>
                  </Col>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      );
    } else {
      return (
        <div>
          <Modal isOpen={this.props.isOpen} onToggle={this.props.onToggle}>
            <ModalHeader onToggle={this.props.onToggle} className="centered">
              Report a Message
            </ModalHeader>
            <ModalBody>
              <Form >
                <FormGroup row>
                  <Label className="centered">
                    {this.props.message.mess + ' writen by ' + this.props.message.commenter}
                  </Label>
                </FormGroup>
                <FormGroup row>
                  <Col>
                    <button
                      className="ui button"
                      onClick={this.props.onToggle}
                    >
                      Report
                    </button>
                  </Col>
                  <Col>
                    <button
                      className="ui button"
                      onClick={this.props.onToggle}
                    >
                      Cancel
                    </button>
                  </Col>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      );
    }
  }
}

export default ReportModal;
