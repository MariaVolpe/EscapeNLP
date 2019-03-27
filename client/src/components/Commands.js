import React, { Component } from 'react';
import { Input } from 'reactstrap';
import '../styles/Commands.css';

class Commands extends Component {

  render() {
    return(
      <div>
        <Input
          value={this.props.command}
          onChange={this.props.onChange}
          onKeyPress={this.props.onKeyPress}
          placeholder="Enter commands here"
          className="command-box"
        />
      </div>
    )
  }
}

export default Commands;
