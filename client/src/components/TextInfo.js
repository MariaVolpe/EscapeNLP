import React, { Component } from 'react';
import { Input } from 'reactstrap';
import '../styles/TextInfo.css';

class TextInfo extends Component {
  render() {

    let prevMessages = this.props.prevMessages;

    let showMessages = prevMessages.map((message, i) =>
      <div className="text-box" >
        <div className="text-list content" key={i}>
          <a className="text">{prevMessages[i]}</a>
        </div>
      </div>
    );

    return(
      <div className="text-container ui comments">
        <h3 class="ui dividing header">Chat Box</h3>
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
