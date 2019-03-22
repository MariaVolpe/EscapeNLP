import React, { Component } from 'react';
import PlayerInfo from './PlayerInfo';
import '../styles/PlayerInfo.css';

class PlayerList extends Component {

  render() {
    let players = this.props.players;
    let evenOrOdd = "";
    let allPlayers = [];

    for (let i=0; i<5; i++) {
      if (i%2 === 1) {
        evenOrOdd = "2";
      }
      else {
        evenOrOdd = "";
      }
      allPlayers.push(<PlayerInfo playerInfo={players[i]} style={"player-box" + evenOrOdd} />)
    }

    return(
      <div>
        {allPlayers}
      </div>
    )
  }
}

export default PlayerList;
