import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
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
      const hoverOverMessage = this.props.reportHover && (i === this.props.reportIndex);
      let entireMessage = <div className="message-body" data-tip={`${message.time}`} data-for="time">
                            {message.mess}
                          </div>;
      if (message.type === 'action') {
        textType = "text command text-message";
      }
      else if (message.type === 'chat') {
        textType = "text chat text-message";
      }
      else if (message.type === 'interpreted') {
        textType = "text interpreted text-message";
        entireMessage = <div className="message-body" data-tip={`${message.time}`} data-for="time" onClick={() => this.props.onInterpretedClick(i)}>
                          {message.mess}
                        </div>;
      }
      else if (message.type === 'new interpretation') {
        textType = "text new-interpreted text-message";
        entireMessage = <div className="message-body" data-tip={`${message.time}`} data-for="time">
                          {message.mess}
                          <div>
                            <button onClick={() => this.props.onNewInterpretationClick(i)}>Yes</button>
                            <button onClick={() => this.props.onNewInterpretationClick(i)}>No</button>
                          </div>
                        </div>;
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
                          <div className={textType} onMouseEnter={() => this.props.onMessageHover(i)} onMouseLeave={() => this.props.onMessageLeave(i)} >
                            {entireMessage}
                            <ReactTooltip key="tooltip" id="time" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`}/>
                            {hoverOverMessage && <div className="report-button">
                                                   <i className="question circle icon"
                                                      onClick={() => this.props.onMessageClick(i)}
                                                      data-tip="report"
                                                      data-for="report"
                                                   />
                                                   <ReactTooltip key="tooltip" id="report" effect="solid" getContent={(dataTip) => `${dataTip}`}/>
                                                 </div>
                            }
                        </div>
                      </div>);
      }
      else if (!sameName) {
        comments.push(<div className="content message" key={i} >
                          <span className="author">
                            {message.commenter}
                          </span>
                          <div className="metadata">
                            <span className="date">{message.time}</span>
                          </div>
                          <div className={textType} onMouseEnter={() => this.props.onMessageHover(i)} onMouseLeave={() => this.props.onMessageLeave(i)} >
                            {entireMessage}
                            {hoverOverMessage && <div className="report-button">
                                                   <i className="question circle icon"
                                                      onClick={() => this.props.onMessageClick(i)}
                                                      data-tip="report"
                                                      data-for="report"
                                                   />
                                                   <ReactTooltip key="tooltip" id="report" effect="solid" getContent={(dataTip) => `${dataTip}`}/>
                                                 </div>
                            }
                          </div>
                      </div>);
      }
    });

    return(
      <div className="ui minimal comments">
        <h3 className="chat-header ui dividing header" style={{marginTop: '1.5%'}}>Chat Box</h3>
        <div className="text-box"  >
          <div className="comment text-container" >{comments}</div>
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
