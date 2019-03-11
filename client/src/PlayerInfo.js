import React, { Component } from 'react';
import { Button } from 'reactstrap';
import AbandonButon from './AbandonButton.js';
import './PlayerInfo.css';

class PlayerInfo extends Component {

  render() {
    const itemsList = Object.entries(this.props.playerInfo.inventory);
    const items = itemsList.map((slot, i) =>
      <div className="item-group" key={i}>
        <a className="item">{slot[i]}</a>
      </div>
    );

    return(
      <div className={this.props.style} >
        <div>
          <a className="player-pic">
            {this.props.playerInfo.picture}
          </a>
          <a className="player-name">
            {this.props.playerInfo.name}
          </a>
        </div>
        <div>
          {items}
        </div>
      </div>
    )
  }
}

export default PlayerInfo;
