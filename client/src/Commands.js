import React, { Component } from 'react';
import { Input } from 'reactstrap';
import './Commands.css';

class Commands extends Component {

  render() {
    return(
      <div>
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
