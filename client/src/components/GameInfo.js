import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import '../styles/GameInfo.css';
import player from '../images/player.png';
import dragon from '../images/dragonite.png';
import key from '../images/dragonite.png';
import floor from '../images/dragonite.png';
import button from '../images/dragonite.png';
import block from '../images/dragonite.png';
import wep from '../images/dragonite.png';
import player1 from '../images/pink.png';
import player2 from '../images/red.png';
import player3 from '../images/black.png';
import player4 from '../images/white.png';
import player5 from '../images/blue.png';
import player6 from '../images/yellow.png';

const pictures = {
  'dragon': dragon,
  'key': key,
  'floor': floor,
  'button': button,
  'block': block,
  'wep': wep,
  'player1': player1,
  'player2': player2,
  'player3': player3,
  'player4': player4,
  'player5': player5,
  'player6': player6
}

class GameInfo extends Component {

  render() {
    const map = this.props.map;
    let board = this.props.board;
    if (board[0] === undefined) {
      board = map;
    }
    let mapData = [];

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
        } else if (board[i][k-1][1] === 'key') {
          mapData.push(<div className="map tile one wide column" data-tip="With this, you are the master of unlocking!" data-for="tile" >
                         <img src={pictures[board[i][k-1][0]]} alt="player" className="board-item" />
                         <img src={pictures[board[i][k-1][1]]} alt="player" className="board-item" />
                       </div>);
        } else if (board[i][k-1][1] === 'floor') {
          mapData.push(<div className="map tile one wide column" data-tip="You can walk on this!" data-for="tile" >
                         <img src={pictures[board[i][k-1][0]]} alt="player" className="board-item" />
                         <img src={pictures[board[i][k-1][1]]} alt="player" className="board-item" />
                       </div>);
        } else if (board[i][k-1][1] === 'dragon') {
          mapData.push(<div className="map tile one wide column" data-tip="Watch out, it's a dragon!" data-for="tile" >
                         <img src={pictures[board[i][k-1][0]]} alt="player" className="board-item" />
                         <img src={pictures[board[i][k-1][1]]} alt="player" className="board-item" />
                       </div>);
        } else if (board[i][k-1][1] === 'player1') {
          mapData.push(<div className="map tile one wide column" data-tip="It's player 1!" data-for="tile" >
                         <img src={pictures[board[i][k-1][0]]} alt="player" className="board-item" />
                         <img src={pictures[board[i][k-1][1]]} alt="player" className="board-item" />
                       </div>);
        } else if (board[i][k-1][1] === 'player2') {
          mapData.push(<div className="map tile one wide column" data-tip="It's player 2!" data-for="tile" >
                         <img src={pictures[board[i][k-1][0]]} alt="player" className="board-item" />
                         <img src={pictures[board[i][k-1][1]]} alt="player" className="board-item" />
                       </div>);
        } else if (board[i][k-1][1] === 'player3') {
          mapData.push(<div className="map tile one wide column" data-tip="It's player 3!" data-for="tile" >
                         <img src={pictures[board[i][k-1][0]]} alt="player" className="board-item" />
                         <img src={pictures[board[i][k-1][1]]} alt="player" className="board-item" />
                       </div>);
        } else if (board[i][k-1][1] === 'player4') {
          mapData.push(<div className="map tile one wide column" data-tip="It's player 4!" data-for="tile" >
                         <img src={pictures[board[i][k-1][0]]} alt="player" className="board-item" />
                         <img src={pictures[board[i][k-1][1]]} alt="player" className="board-item" />
                       </div>);
        } else if (board[i][k-1][1] === 'player5') {
          mapData.push(<div className="map tile one wide column" data-tip="It's player 5!" data-for="tile" >
                         <img src={pictures[board[i][k-1][0]]} alt="player" className="board-item" />
                         <img src={pictures[board[i][k-1][1]]} alt="player" className="board-item" />
                       </div>);
        } else {
          mapData.push(<div className="map tile one wide column" data-tip="What is this?" data-for="tile" >
                         <img src={pictures[board[i][k-1][0]]} alt="player" className="board-item" />
                         <img src={pictures[board[i][k-1][1]]} alt="player" className="board-item" />
                       </div>);
        }
      });
    });

    mapData.push(<ReactTooltip id="tile" effect="solid" getContent={(dataTip) => `${dataTip}`}/>);

    return(
      <div className="ui grid">
        {mapData}
      </div>
    )
  }
}

export default GameInfo;
