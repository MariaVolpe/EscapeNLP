import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import '../styles/GameInfo.css';
import dragon from '../images/dragonite.png';
import key from '../images/dragonite.png';
import floor from '../images/dragonite.png';
import button from '../images/dragonite.png';
import block from '../images/dragonite.png';
import wep from '../images/dragonite.png';
import floor_switch from '../images/floor_switch.png'
import player1 from '../images/pink.png';
import player2 from '../images/red.png';
import player3 from '../images/black.png';
import player4 from '../images/white.png';
import player5 from '../images/blue.png';
import player6 from '../images/wall.png';
import weight from '../images/weight.png'

const pictures = {
  'dragon': dragon,
  'key': key,
  'weight': weight,
  'wall': player6,
  'floor_switch': floor_switch,
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
    let board = this.props.board;
    if (board[0] === undefined) {
      board = new Array(15).fill(0).map(() => new Array(12).fill(0));;
    }
    let mapData = [];

    for (let i=0; i<12; i++) {
      for (let k=0; k<15; k++) {
        if (k === 0) {
          mapData.push(<div className="map one wide column" >
                         {String.fromCharCode(i+65)}
                       </div>);
        }
        if (board[k][i][1] !== undefined) {
        mapData.push(<div className="map tile one wide column" data-tip={`${board[k][i][1]}`} data-for="tile" >
                       <img src={pictures[board[k][i][0]]} alt='' className="board-item" />
                       <img src={pictures[board[k][i][1]]} alt='' className="board-item" />
                     </div>);
        }
        else {
        mapData.push(<div className="map tile one wide column" data-tip="" data-for="tile" >
               <img src={pictures[board[k][i][0]]} alt='' className="board-item" />
               <img src={pictures[board[k][i][1]]} alt='' className="board-item" />
             </div>);
        }
      }
    }

    let seconds = Math.round(this.props.timer/1000);
    let minutes = Math.round(seconds / 60);
    let hours = Math.round(minutes / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;
    let timerSeconds = '';
    let timerMinutes = '';
    let timerHours = '';
    if (seconds < 10) {
      timerSeconds = '0' + seconds.toString();
    } else {
      timerSeconds = seconds.toString();
    }
    if (minutes < 10) {
      timerMinutes = '0' + minutes.toString();
    } else {
      timerMinutes = minutes.toString();
    }
    if (hours < 10) {
      timerHours = '0' + hours.toString();
    } else {
      timerHours = hours.toString();
    }

    const time = `Timer ${timerHours}:${timerMinutes}:${timerSeconds}`;

    for (let i=0; i<16; i++) {
      if (i !== 0) {
       mapData.push(<div className="map one wide column" >
                      {i}
                    </div>);
     } else {
       mapData.push(<div className="map one wide column">
                      <div className="timer">{time}</div>
                    </div>);
     }
    }

    mapData.push(<ReactTooltip id="tile" effect="solid" getContent={(dataTip) => `${dataTip}`}/>);

    return(
      <div className="ui grid">
        {mapData}
      </div>
    )
  }
}

export default GameInfo;
