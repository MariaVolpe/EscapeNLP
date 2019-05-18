import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import '../styles/TextInfo.css';

class TextInfo extends Component {

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
      if (prevName === message.commenter) {
        sameName = true;
      }
      else if (prevName !== message.commenter) {
        sameName = false;
        prevName = message.commenter;
      }
      let timeOf = message.type === 'flavor' ? '' : message.time;
      const hoverOverMessage = this.props.reportHover && (i === this.props.reportIndex);
      const isInterpretMessage = message.type === 'interpreted' || message.type === 'new interpretation' || message.type === 'flavor';
      let messageBody = "message-body"
      if (!hoverOverMessage) {
        messageBody = "full-message";
      }
      let entireMessage = <div className={messageBody} data-tip={`${message.time}`} data-for="time">
                            {message.text}
                          </div>;
      if (message.type === 'action') {
        textType = "text command ";
      }
      else if (message.type === 'chat') {
        textType = "text chat ";
      }
      else if (message.type === 'interpreted') {
        textType = "text interpreted";
        entireMessage = <div className="full-message" data-tip='Wrong action?' data-for="time" onClick={() => this.props.onInterpretedClick(i)}>
                          {message.text}
                        </div>;
      }
      else if (message.type === 'flavor') {
        textType = "text flavor-text";
        entireMessage = <div className="full-message">
                          {message.text}
                        </div>;
      }
      else if (message.type === 'new interpretation') {
        textType = "text new-interpreted";
        entireMessage = <div className="full-message" data-tip={`${message.time}`} data-for="time">
                          {message.text}
                          <div>
                            <button onClick={() => this.props.onNewInterpretationClick(i, 'yes')}>Yes</button>
                            <button onClick={() => this.props.onNewInterpretationClick(i, 'no')}>No</button>
                          </div>
                        </div>;
      }

      if (sameName) {
        comments.push(<div className="comment text-container" style={{marginTop: '5%'}}>
                        <div className="content" key={i} >
                          <div className={textType} onMouseEnter={() => this.props.onMessageHover(i)} onMouseLeave={() => this.props.onMessageLeave(i)} >
                            {entireMessage}
                            {!isInterpretMessage && hoverOverMessage &&
                                                 <div className="report-button">
                                                   <i className="question circle icon"
                                                      onClick={() => this.props.onMessageClick(i)}
                                                      data-tip="report"
                                                      data-for="report"
                                                   />
                                                   <ReactTooltip key="tooltip" id="report" effect="solid" getContent={(dataTip) => `${dataTip}`}/>
                                                 </div>
                            }
                          </div>
                          <ReactTooltip key="tooltip" id="time" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`}/>
                        </div>
                      </div>);
      }
      else if (!sameName) {
        comments.push(<div className="comment text-container" tyle={{marginTop: '5%'}}>
                        <div className="content message" key={i} >
                          <span className="author">
                            {message.commenter}
                          </span>
                          <div className="metadata">
                            <span className="date">{timeOf}</span>
                          </div>
                          <div className="ui divider" style={{marginBottom: '3%'}}/>
                          <div className={textType} onMouseEnter={() => this.props.onMessageHover(i)} onMouseLeave={() => this.props.onMessageLeave(i)} >
                            {entireMessage}
                            {!isInterpretMessage && hoverOverMessage &&
                                                 <div className="report-button">
                                                   <i className="question circle icon"
                                                      onClick={() => this.props.onMessageClick(i)}
                                                      data-tip="report"
                                                      data-for="report"
                                                   />
                                                   <ReactTooltip key="tooltip" id="report" effect="solid" getContent={(dataTip) => `${dataTip}`}/>
                                                 </div>
                            }
                          </div>
                        </div>
                      </div>);
      }
    });

    let passIn;
    if(this.props.chatOption === 'chat')
      passIn = 'Toggle Action';
    else {
      passIn = 'Toggle Chat';
    }

    return(
      <div className="ui minimal comments">
        <h3 className="chat-header ui dividing header" style={{marginTop: '1.5%'}}>Chat Box</h3>
        <div className="text-box"  >
          {comments}
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
            {passIn}
          </button>
      </div>
    )
  }
}

export default TextInfo;
