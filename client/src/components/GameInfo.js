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
import floor_switch from '../images/floor_switch.png'
import floor_switch_activated from '../images/floor_switch_activated.png';
import player1 from '../images/pink.png';
import player2 from '../images/red.png';
import player3 from '../images/black.png';
import player4 from '../images/white.png';
import player5 from '../images/blue.png';
import wall from '../images/wall.png';
import weight from '../images/weight.png';
import poster from '../images/poster.png';
import binary_switch from '../images/binary_switch.png';
import binary_switch_activated from '../images/binary_switch_activated.png';
import bookshelf from '../images/bookshelf.png';
import door from '../images/door.png';
import forge from '../images/forge.png';
import pot from '../images/pot.png';
import exit from '../images/exit.png';
import VictoryModal from './VictoryModal';

const pictures = {
  'dragon': dragon,
  'key': key,
  'weight': weight,
  'wall': wall,
  'floor switch': floor_switch,
  'floor_switch_activated': floor_switch_activated,
  'button': button,
  'block': block,
  'wep': wep,
  'poster': poster,
  'switch': binary_switch,
  'binary_switch_activated' : binary_switch_activated,
  'bookshelf': bookshelf,
  'door': door,
  'forge': forge,
  'pot': pot,
  'exit': exit,
  'player1': player1,
  'player2': player2,
  'player3': player3,
  'player4': player4,
  'player5': player5
}

class GameInfo extends Component {
  constructor(props){
    super(props);

    this.state = {victory: true};
    this.stayOnPage = this.stayOnPage.bind(this);
  }

  stayOnPage = (event) => {
    this.setState({victory: !this.state.victory});
    event.preventDefault();
  }

  render() {
    let board = this.props.board;
    let mapData = [];
    let victory = true; // get real state from backend

    if(victory === true){
      for (let i=0; i<12; i++) {
        for (let k=0; k<15; k++) {
          if (k === 0) {
            mapData.push(<div className="map one wide column" >
                           {String.fromCharCode(i+65)}
                         </div>);
          }
          if (board[0] === undefined) { }
          else if (board[k][i][1] === undefined) {
          mapData.push(<div className="map victory one wide column" data-tip="The Rare W" data-for="victory" >
                         <img src={pictures[board[k][i][0].sprite]} alt='' className="board-item" />
                       </div>);
          }
          else {
          mapData.push(<div className="map victory one wide column" data-tip={`The Rare W`} data-for="victory" >
                 <img src={pictures[board[k][i][0].sprite]} alt='' className="board-item" />
                 <img src={pictures[board[k][i][1].sprite]} alt='' className="board-item" />
               </div>);
          }
        }
      }

      let seconds = Math.round(this.props.timer/1000);
      let minutes = Math.round(seconds / 60);
      seconds = seconds % 60;
      minutes = minutes % 60;
      let timerSeconds = '';
      let timerMinutes = '';
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

      const time = `Timer ${timerMinutes}:${timerSeconds}`;

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

      mapData.push(<ReactTooltip id="victory" effect="solid" getContent={(dataTip) => `${dataTip}`}/>);
    } else {
      for (let i=0; i<12; i++) {
        for (let k=0; k<15; k++) {
          if (k === 0) {
            mapData.push(<div className="map one wide column" >
                           {String.fromCharCode(i+65)}
                         </div>);
          }
          if (board[0] === undefined) { }
          else if (board[k][i][1] === undefined) {
          mapData.push(<div className="map tile one wide column" data-tip="" data-for="tile" >
                         <img src={pictures[board[k][i][0].sprite]} alt='' className="board-item" />
                       </div>);
          }
          else {
          mapData.push(<div className="map tile one wide column" data-tip={`${board[k][i][1].hint}`} data-for="tile" >
                 <img src={pictures[board[k][i][0].sprite]} alt='' className="board-item" />
                 <img src={pictures[board[k][i][1].sprite]} alt='' className="board-item" />
               </div>);
          }
        }
      }

      let seconds = Math.round(this.props.timer/1000);
      let minutes = Math.round(seconds / 60);
      seconds = seconds % 60;
      minutes = minutes % 60;
      let timerSeconds = '';
      let timerMinutes = '';
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

      const time = `Timer ${timerMinutes}:${timerSeconds}`;

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
    }

    return(
      <div className="ui grid">
        {mapData}
        <VictoryModal isOpen={this.state.victory} stayOnPage={this.stayOnPage}/>
      </div>
    )
  }
}

export default GameInfo;
