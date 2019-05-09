import React, { Component } from 'react';
import '../styles/TextInfo.css';

class TextInfo extends Component {

  componentDidMount = () => {
    this.scrollToBottom();
  }

  componentDidUpdate = () => {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    let scrollElement = document.getElementsByClassName("text-box");
    scrollElement[0].scrollTop = scrollElement[0].scrollHeight;
  }

  findHeightDifference = (samePlayerMessages) => {
    let change = 1.1;
    if (samePlayerMessages > 0) {
      change = 0.45;
    }
    let totalMessages = 74.5 / 17 * ((this.props.prevMessages.length - 1) * (change - 1));
    let heightDiff = 74.5 - totalMessages;
    return heightDiff;
  }

  render() {

    const prevMessages = this.props.prevMessages;
    let comments = [];
    const chatOption = this.props.chatOption;
    let keyPress;
    let change;
    let placeholder;
    let value;
    let disabled = false;

    if (chatOption === 'chat') {
      value = this.props.message;
      keyPress = this.props.onKeyPress;
      change = this.props.onChange;
      placeholder = "Chat with group";
    } else {
      value = this.props.command;
      keyPress = this.props.onCommandKeyPress;
      change = this.props.onCommandChange;
      disabled = this.props.commandDisabled || this.props.gameComplete || !this.props.gameStart;
      if (disabled && !this.props.gameComplete && this.props.gameStart) {
        placeholder = "Wait until action is executed";
      } else if (this.props.gameComplete) {
        placeholder = "Game has ended";
      } else if (!this.props.gameStart) {
        placeholder = "Wait until game has started!";
      } else {
        placeholder = "Enter commands here";
      }
    }

    let sameName = false;
    let prevName = "";
    let numOfSames = 0;
    let textType = "text";

    prevMessages.forEach((message, i) => {
      if (message.type === 'action') {
        textType = "text command text-message";
      }
      else if (message.type === 'chat') {
        textType = "text chat text-message";
      }
      else if (message.type === 'interpreted') {
        textType = "text interpreted text-message";
      }
      if (prevName === message.commenter) {
        sameName = true;
      }
      else if (prevName !== message.commenter) {
        sameName = false;
        prevName = message.commenter;
      }
      if (sameName) {
        comments.push(<div className="content" key={i} >
                          <div className={textType} onClick={() => this.props.onMessageClick(i)}>
                            {message.mess}
                          </div>
                        </div>);
      }
      else if (!sameName) {
        numOfSames += 1;
        comments.push(<div className="content message" key={i} >
                          <span className="author">
                            {message.commenter}
                          </span>
                          <div className="metadata">
                            <span className="date">{message.time}</span>
                          </div>
                          <div className={textType} onClick={() => this.props.onMessageClick(i)}>
                            {message.mess}
                          </div>
                        </div>);
      }

    });

    let heightDiff = this.findHeightDifference(numOfSames) - 10;


    return(
      <div className="ui minimal comments">
        <h3 className="chat-header ui dividing header" style={{marginTop: '1.5%'}}>Chat Box</h3>
        <div className="text-box"  >
          <div className="comment text-container" style={{"bottom": "-" + heightDiff + "vh"}} >{comments}</div>
        </div>
          <form className="ui form">
            <textarea
              value={value}
              onChange={change}
              onKeyPress={keyPress}
              placeholder={placeholder}
              className="talk-input"
              disabled={disabled}
              rows="3"
              style={{width: '99%'}}
            ></textarea>
          </form>
          <button className="ui button chat-change"
            onClick={this.props.onChatOptionChange}
            style={{width: '99.5%', marginLeft: '2.5%', marginTop: '0.75%'}}
          >
            {this.props.chatOption}
          </button>
      </div>
    )
  }
}

export default TextInfo;
