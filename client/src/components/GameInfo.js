import React, { Component } from 'react';
import '../styles/GameInfo.css';
import player from '../images/player.png'

class GameInfo extends Component {



  render() {
    const ready = this.props.allPlayersReady;
    const map = this.props.map;
    let board = this.props.board;
    if (board[0] === undefined) {
      board = map;
    }
    let mapData = [];

    if (ready) {
      map.forEach((row, i) => {
        row.forEach((element, k) => {
          if (k === 0 && i < 12) {
            mapData.push(<div className="map one wide column" >
                           {String.fromCharCode(i+65)}
                         </div>);
          } else if (i === 12 && k !== 0) {
            mapData.push(<div className="map one wide column" >
                           {k}
                         </div>);
          } else if (i === 12 && k === 0) {
            mapData.push(<div className="map one wide column" />)
          } else if (board[i][k-1] === 'player') {
            mapData.push(<div className="map tile one wide column" >
                           <img src={player} alt="player" className="board-item" />
                         </div>);
          } else {
            mapData.push(<div className="map tile one wide column" >
                           {board[i][k-1]}
                         </div>);
          }
        });
      });
    }
    else {
      map.forEach((row, i) => {
        row.forEach((element, k) => {
          if (k === 0 && i < 12) {
            mapData.push(<div className="map one wide column" >
                           {String.fromCharCode(i+65)}
                         </div>);
          } else if (i === 12 && k !== 0) {
            mapData.push(<div className="map one wide column" >
                           {k}
                         </div>);
          } else if (i === 12 && k === 0) {
            mapData.push(<div className="map one wide column" />);
          } else if (board[i][k-1] === 'player') {
            mapData.push(<div className="map tile one wide column" >
                           <img src={player} alt="player" className="board-item" />
                         </div>);
          } else {
            mapData.push(<div className="map tile one wide column" >
                           {board[i][k-1]}
                         </div>);
          }
        });
      });
    }

    return(
      <div className="ui grid">
        {mapData}
      </div>
    )
  }
}

export default GameInfo;
