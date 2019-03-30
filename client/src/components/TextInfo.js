import React, { Component } from 'react';
import { Input } from 'reactstrap';
import '../styles/TextInfo.css';

class TextInfo extends Component {
  render() {

    let prevMessages = this.props.prevMessages;
    let currPlayer = this.props.currPlayer;
    let comments = [];

    prevMessages.forEach((message) => {
      if (message[0] === currPlayer) {
        comments.push(<div className="content" >
                          <a class="author">
                            {"You"}
                          </a>
                          <div className="metadata">
                            <span className="date">{message[1]}</span>
                          </div>
                          <div className="text" >
                            {message[2]}
                          </div>
                        </div>);
      }
      else {
        comments.push(<div className="content" >
                          <a class="author">
                            {message[0]}
                          </a>
                          <div className="metadata">
                            <span className="date">{message[1]}</span>
                          </div>
                          <div className="text" >
                            {message[2]}
                          </div>
                        </div>);
      }
    });

    return(
      <div className="ui minimal comments">
        <h3 class="ui dividing header">Chat Box</h3>
        <div className="text-box">
          <div className="comment text-container">{comments}</div>
        </div>
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
