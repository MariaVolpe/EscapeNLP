import React, { Component } from 'react';
import { Input } from 'reactstrap';
import Commands from './Commands';
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
      change = 0.6;
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
    let chatBox;

    if (chatOption === '0') {
      chatBox = <div className="talk-input">
                  <Input
                      value={this.props.message}
                      onChange={this.props.onChange}
                      onKeyPress={this.props.onKeyPress}
                      placeholder="Chat with group"
                  />
                </div>}
    else {
      chatBox = <Commands command={this.props.command} onKeyPress={this.props.onCommandKeyPress} onChange={this.props.onCommandChange} />
    }

    let sameName = false;
    let prevName = "";
    let numOfSames = 0;
    let textType = "text";

    prevMessages.forEach((message) => {
      if (message.type === 'action') {
        textType = "text command";
      }
      else if (message.type === 'chat') {
        textType = "text";
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
          comments.push(<div className="content" >
                            <div className={textType} >
                              {message.mess}
                            </div>
                          </div>);
        }
        else {
          comments.push(<div className="content" >
                            <div className={textType} >
                              {message.mess}
                            </div>
                          </div>);
        }
      }
      else if (!sameName) {
        if (message.commenter === currPlayer) {
          comments.push(<div className="content" >
                            <a class="author">
                              {"You"}
                            </a>
                            <div className="metadata">
                              <span className="date">{message.time}</span>
                            </div>
                            <div className={textType} >
                              {message.mess}
                            </div>
                          </div>);
        }
        else {
          comments.push(<div className="content" >
                            <a class="author">
                              {message.commenter}
                            </a>
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
        <h3 class="ui dividing header">Chat Box</h3>
        <div className="text-box"  >
          <div className="comment text-container" style={{"bottom": "-" + heightDiff + "vh"}} >{comments}</div>
        </div>
        <div>
            <select class="dropdown chat-change" onChange={this.props.onChatOptionChange}>
            <option class="menu item" value="0">Chat</option>
            <option class="menu item" value="1">Action</option>
            </select>
            {chatBox}
        </div>
      </div>
    )
  }
}

export default TextInfo;
