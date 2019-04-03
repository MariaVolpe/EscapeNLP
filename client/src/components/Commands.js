import React, { Component } from 'react';
import { Input } from 'reactstrap';
import '../styles/TextInfo.css';

class Commands extends Component {

  render() {
    return(
      <div className="talk-input">
        <Input
          value={this.props.command}
          onChange={this.props.onChange}
          onKeyPress={this.props.onKeyPress}
          placeholder="Enter commands here"
        />
      </div>
    )
  }
}

export default Commands;
