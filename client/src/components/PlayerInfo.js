import React, { Component } from 'react';
<<<<<<< HEAD:client/src/PlayerInfo.js
import './PlayerInfo.css';
=======
import { Button } from 'reactstrap';
import AbandonButon from './AbandonButton';
import '../styles/PlayerInfo.css';
>>>>>>> d5483488e454366dc1bbd43eeb8b4966562f39ea:client/src/components/PlayerInfo.js

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
