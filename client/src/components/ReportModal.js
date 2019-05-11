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
              Was this the Wrong Action?
            </ModalHeader>
            <ModalBody>
              <Form >
                <FormGroup row>
                  <Label className="centered">
                    {'Did you mean to use one of these ACTIONS?'}
                  </Label>
                </FormGroup>
                <FormGroup row>
                  <Col>
                  <button
                    className="red ui button"
                    onClick={this.props.onToggle}
                  >
                    Move
                  </button>
                  </Col>
                  <Col>
                  <button
                    className="orange ui button"
                    onClick={this.props.onToggle}
                  >
                    Look
                  </button>
                  </Col>
                  <Col>
                  <button
                    className="yellow ui button"
                    onClick={this.props.onToggle}
                  >
                    Take
                  </button>
                  </Col>
                  <Col>
                  <button
                    className="green ui button"
                    onClick={this.props.onToggle}
                  >
                    Give
                  </button>
                  </Col>
                  <Col>
                  <button
                    className="blue ui button"
                    onClick={this.props.onToggle}
                  >
                    Destroy
                  </button>
                  </Col>
                  <Col>
                  <button
                    className="purple ui button"
                    onClick={this.props.onToggle}
                  >
                    Attack
                  </button>
                  </Col>
                  <Col>
                  <button
                    className="pink ui button"
                    onClick={this.props.onToggle}
                  >
                    Place
                  </button>
                  </Col>
                  <Col>
                  <button
                    className="brown ui button"
                    onClick={this.props.onToggle}
                  >
                    Jump
                  </button>
                  </Col>
                  <Col>
                  <button
                    className="violet ui button"
                    onClick={this.props.onToggle}
                  >
                    Speak
                  </button>
                  </Col>
                  <Col>
                  <button
                    className="teal ui button"
                    onClick={this.props.onToggle}
                  >
                    Activate
                  </button>
                  </Col>
                  <Col>
                  <button
                    className="olive ui button"
                    onClick={this.props.onToggle}
                  >
                    Deactivate
                  </button>
                  </Col>
                  <Col>
                  <button
                    className="primary ui button"
                    onClick={this.props.onToggle}
                  >
                    Use
                  </button>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col>
                    <button
                      className="ui button"
                      onClick={this.props.onToggle}
                    >
                      Correct Action Missing
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
