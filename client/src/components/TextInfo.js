import React, { Component } from 'react';
import { Input } from 'reactstrap';
import '../styles/TextInfo.css';

class TextInfo extends Component {
  render() {

    let prevMessages = this.props.prevMessages;
    let length = prevMessages.length;

    let showMessages = prevMessages.map((message, i) =>
      <div className="text-list content" key={i}>
        <a className="text">{prevMessages[i]}</a>
      </div>
    );

    return(
      <div className="text-container ui comments">
        <div className="text-box comment">{showMessages}</div>
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
