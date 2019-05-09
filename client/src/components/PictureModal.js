import React, { Component } from 'react';
import { Label, Form, FormGroup, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../styles/PictureModal.css';
import defaultIcon from '../images/playericon.png';
import kirbyIcon from '../images/kirbyoutline.png';
import dmc4Icon from '../images/dmc4logo.png';
import pikachuIcon from '../images/pikachuicon.png';

class PictureModal extends Component {

  render() {
    const playerIconList = [];
    playerIconList.push(<div
                          className="avatar-box centered"
                          onClick={() => this.props.onAvatarClick('defaultIcon')}
                        >
                          <img src={defaultIcon} alt='' className="avatar" />
                        </div>);
    playerIconList.push(<div
                          className="avatar-box centered"
                          onClick={() => this.props.onAvatarClick('pikachuIcon')}
                        >
                          <img src={pikachuIcon} alt='' className="avatar" />
                        </div>);
    playerIconList.push(<div
                          className="avatar-box centered"
                          onClick={() => this.props.onAvatarClick('dmc4Icon')}
                        >
                          <img src={dmc4Icon} alt='' className="avatar" />
                        </div>);
    playerIconList.push(<div
                          className="avatar-box centered"
                          onClick={() => this.props.onAvatarClick('kirbyIcon')}
                        >
                          <img src={kirbyIcon} alt='' className="avatar" />
                        </div>);

    return (
      <div>
        <Modal isOpen={this.props.isOpen} onToggle={this.props.onToggle}>
          <ModalHeader onToggle={this.props.onToggle} className="centered">
            Choose your picture
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.props.handleSubmit}>
              <FormGroup row>
                {playerIconList}
              </FormGroup>
              <FormGroup>
                <button
                  data-dismiss="modal"
                  className="ui button"
                >
                  Close
                </button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default PictureModal;
