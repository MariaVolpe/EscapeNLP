import React, { Component } from 'react';
import { Input } from 'reactstrap';
import '../styles/TextInfo.css';

class TextInfo extends Component {
  render() {

    let prevMessages = this.props.prevMessages;

    let showMessages = prevMessages.map((message, i) =>
      <div className="text-list" key={i}>
        <a className="test-box">{prevMessages[i]}</a>
      </div>
    );

    return(
      <div className="text-container">
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
