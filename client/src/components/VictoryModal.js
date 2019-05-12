import React from 'react';
import { Input, Form, FormGroup, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../styles/ConfirmModal.css';

class VictoryModal extends React.Component {
  render(){
    return(
      <div>
        <Modal isOpen={this.props.isOpen}>
          <ModalBody>
            <Form>
              <div style={{textAlign: 'center', margin: '5%'}}>
                <h3>You Have Escaped! Victory!</h3>
              </div>
              <Button
                color="danger"
                className="centered"
              >
                Go Back Home
              </Button>

              <Button
                color="success"
                className="centered"
                onClick={this.props.stayOnPage}
                style={{marginLeft: '10%'}}
              >
                Stay and Chat
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default VictoryModal;
