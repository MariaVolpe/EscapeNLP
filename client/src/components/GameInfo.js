import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import '../styles/GameInfo.css';
import dragon from '../images/dragonite.png';
import floor from '../images/dragonite.png';
import button from '../images/dragonite.png';
import block from '../images/dragonite.png';
import wep from '../images/dragonite.png';
import impression from '../images/impression.png'
import impression_activated from '../images/impression_activated.png';
import key from '../images/key.png';
import sword from '../images/sword.png';
import hilt from '../images/hilt.png';
import blade from '../images/blade.png';
import player0 from '../images/pink.png';
import player1 from '../images/red.png';
import player2 from '../images/black.png';
import player3 from '../images/white.png';
import player4 from '../images/blue.png';
import playerDefault from '../images/yellow.png';
import wall from '../images/wall.png';
import weight from '../images/weight.png';
import poster from '../images/poster.png';
import lever from '../images/lever.png';
import lever_activated from '../images/lever_activated.png';
import bookshelf from '../images/bookshelf.png';
import door from '../images/door.png';
import door_activated from '../images/door_activated.png'
import forge from '../images/forge.png';
import pot from '../images/pot.png';
import exit from '../images/exit.png';
import VictoryModal from './VictoryModal';

const pictures = {
  'dragon': dragon,
  'key': key,
  'weight': weight,
  'wall': wall,
  'impression': impression,
  'impression_activated': impression_activated,
  'button': button,
  'block': block,
  'wep': wep,
  'poster': poster,
  'lever': lever,
  'lever_activated' : lever_activated,
  'bookshelf': bookshelf,
  'door': door,
  'door_activated': door_activated,
  'forge': forge,
  'pot': pot,
  'exit': exit,
  'sword': sword,
  'blade': blade,
  'hilt': hilt,
  'player0': player0,
  'player1': player1,
  'player2': player2,
  'player3': player3,
  'player4': player4,
  'playerDefault': playerDefault
}

class GameInfo extends Component {
  constructor(props){
    super(props);

    this.state = { showVictoryModal: false };   // get real state from backend
    this.stayOnPage = this.stayOnPage.bind(this);
  }

  stayOnPage = (event) => {
    this.setState({showVictoryModal: !this.state.showVictoryModal});
    event.preventDefault();
  }

  render() {
    let board = this.props.board;
    let mapData = [];
    let victory = false; // get real state from backend

    if(victory){
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
          else if (board[k][i][0].sprite === 'floor' && board[k][i].length > 2) {
            mapData.push(<div className="map tile one wide column" data-tip={`${board[k][i][1].hint}`} data-for="tile" >
                   <img src={pictures[board[k][i][1].sprite]} alt='' className="board-item" />
                   <img src={pictures[board[k][i][2].sprite]} alt='' className="board-item" />
                 </div>);
          } else {
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
        <VictoryModal isOpen={this.state.showVictoryModal} stayOnPage={this.stayOnPage}/>
      </div>
    )
  }
}

export default GameInfo;
