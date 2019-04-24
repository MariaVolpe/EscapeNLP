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
    let totalMessages = 74.5 / 17 * ((this.props.prevMessages.length - 1) * (change));
    let heightDiff = 74.5 - totalMessages;
    return heightDiff;
  }

  render() {

    const prevMessages = this.props.prevMessages;
    const currPlayer = this.props.currPlayer;
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
        textType = "text command";
      }
      else if (message.type === 'chat') {
        textType = "text chat";
      }
      if (!sameName && prevName !== message.commenter) {
        prevName = message.commenter;
      }
      else if (!sameName && prevName === message.commenter) {
        sameName = true;
        numOfSames += 1;
      }
      else if (sameName && prevName !== message.commenter) {
        sameName = false;
      }
      if (sameName) {
        numOfSames += 1;
        if (message.commenter === currPlayer) {
          comments.push(<div className="content message" key={i} >
                            <div className={textType} >
                              {message.mess}
                            </div>
                          </div>);
        }
        else {
          comments.push(<div className="content" key={i} >
                            <div className={textType} >
                              {message.mess}
                            </div>
                          </div>);
        }
      }
      else if (!sameName) {
        if (message.commenter === currPlayer) {
          comments.push(<div className="content message" key={i} >
                            <span className="author">
                              {"You"}
                            </span>
                            <div className="metadata">
                              <span className="date">{message.time}</span>
                            </div>
                            <div className={textType} >
                              {message.mess}
                            </div>
                          </div>);
        }
        else {
          comments.push(<div className="content message" key={i} >
                            <span className="author">
                              {message.commenter}
                            </span>
                            <div className="metadata">
                              <span className="date">{message.time}</span>
                            </div>
                            <div className={textType} >
                              {message.mess}
                            </div>
                          </div>);
        }
      }

    });

    let heightDiff = this.findHeightDifference(numOfSames);


    return(
      <div className="ui minimal comments">
        <h3 className="chat-header ui dividing header">Chat Box</h3>
        <div className="text-box"  >
          <div className="comment text-container" style={{"bottom": "-" + heightDiff + "vh"}} >{comments}</div>
        </div>
        <div className="ui left action input chat-action">
          <button className="ui button chat-change" onClick={this.props.onChatOptionChange} >
            {this.props.chatOption}
          </button>
          <input
            value={value}
            onChange={change}
            onKeyPress={keyPress}
            placeholder={placeholder}
            className="talk-input"
            disabled={disabled}
          />
        </div>
      </div>
    )
  }
}

export default TextInfo;
