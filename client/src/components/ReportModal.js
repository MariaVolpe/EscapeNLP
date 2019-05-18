import React, { Component } from 'react';
import { Form, Button, FormGroup, Label, Modal, ModalHeader, ModalBody, Col } from 'reactstrap';
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
              <FormGroup row>
                <Label className="centered">
                  {'Did you mean to use one of these ACTIONS?'}
                </Label>
              </FormGroup>
              <div className="ui grid" style={{marginLeft: '5%', marginRight: '2%'}}>
                <div className="four wide column">
                  <button
                    className="tiny ui black basic button"
                    onClick={this.props.onToggle}
                  >
                    Move
                  </button>
                </div>
                <div className="four wide column">
                  <button
                    className="tiny ui black basic button"
                    onClick={this.props.onToggle}
                  >
                    Look
                  </button>
                </div>
                <div className="four wide column">
                  <button
                    className="tiny ui black basic button"
                    onClick={this.props.onToggle}
                  >
                    Take
                  </button>
                </div>
                <div className="four wide column">
                  <button
                    className="tiny ui black basic button"
                    onClick={this.props.onToggle}
                  >
                    Give
                  </button>
                </div>
                <div className="four wide column">
                  <button
                    className="tiny ui black basic button"
                    onClick={this.props.onToggle}
                  >
                    Destroy
                  </button>
                </div>
                <div className="four wide column">
                  <button
                    className="tiny ui black basic button"
                    onClick={this.props.onToggle}
                  >
                    Attack
                  </button>
                </div>
                <div className="four wide column">
                  <button
                    className="tiny ui black basic button"
                    onClick={this.props.onToggle}
                  >
                    Place
                  </button>
                </div>
                <div className="four wide column">
                  <button
                    className="tiny ui black basic button"
                    onClick={this.props.onToggle}
                  >
                    Jump
                  </button>
                </div>
                <div className="four wide column">
                  <button
                    className="tiny ui black basic button"
                    onClick={this.props.onToggle}
                  >
                    Activate
                  </button>
                </div>
                <div className="four wide column">
                  <button
                    className="tiny ui black basic button"
                    onClick={this.props.onToggle}
                  >
                    Turn Off
                  </button>
                </div>
                <div className="four wide column">
                  <button
                    className="tiny ui black basic button"
                    onClick={this.props.onToggle}
                  >
                    Use
                  </button>
                </div>
                <div className="four wide column">
                  <button
                    className="tiny ui black basic button"
                    onClick={this.props.onToggle}
                  >
                    Other
                  </button>
                </div>
              </div>
              <FormGroup row style={{marginTop: '5%'}}>
                <Col>
                  <Button
                    color="danger"
                    onClick={this.props.onToggle}
                    style={{width: '25%'}}
                  >
                    Cancel
                  </Button>
                </Col>
              </FormGroup>
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
                    {this.props.message.text + ' writen by ' + this.props.message.commenter}
                  </Label>
                </FormGroup>
                <FormGroup row style={{marginLeft: '0%'}}>
                  <Col>
                    <Button
                      color="danger"
                      onClick={this.props.onToggle}
                      style={{width: '90%'}}
                    >
                      Cancel
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      color="success"
                      onClick={this.props.onToggle}
                      style={{width: '90%'}}
                    >
                      Report
                    </Button>
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
