import React, { Component } from 'react';
import { Input } from 'reactstrap';
import './TextInfo.css';

class TextInfo extends Component {
  render() {

    let prevMessages = this.props.prevMessages;
    let length = prevMessages.length;

    let showMessages = prevMessages.map((message, i) =>
      <div className="text-message" key={i}>
        <a>{prevMessages[length - i - 1]}</a>
      </div>
    );

    return(
      <div>
        <div className="text-box">{showMessages}</div>
        <div>
          <Input
            value={this.props.message}
            onChange={this.props.onChange}
            onKeyPress={this.props.onKeyPress}
            placeholder="Chat with group"
            className="talk-input"
          />
        </div>
      </div>
    )
  }
}

export default TextInfo;
