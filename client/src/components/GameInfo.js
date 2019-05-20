import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import '../styles/GameInfo.css';
import dragon from '../images/dragonite.png';
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
import forge_activated from '../images/forge_activated.png'
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
  'poster': poster,
  'lever': lever,
  'lever_activated' : lever_activated,
  'bookshelf': bookshelf,
  'door': door,
  'door_activated': door_activated,
  'forge': forge,
  'forge_activated': forge_activated,
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

  getTime = () => {
    let seconds = Math.round(this.props.timer/1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
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
    return time;
  }

  render() {
    let board = this.props.board;
    let mapData = [];
    let victory = this.props.gameComplete; // get real state from backend

    if(victory){
      for (let i=0; i<12; i++) {
        for (let k=0; k<16; k++) {
          const victoryClass = "map victory one wide column pic" + i.toString() + '-' + k.toString();
          if (i===9 && k===2) {
            mapData.push(<div className={victoryClass} data-tip="poyo!" data-for="victory" />);
          } else {
            mapData.push(<div className={victoryClass} data-tip="CONGRATULATIONS" data-for="victory" />);
          }
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
                         <img src={pictures[board[k][i][0].sprite]} alt='' className="board-item" onClick={()=>this.props.onClick(i,k)}/>
                       </div>);
          }
          else if (board[k][i][0].sprite === 'floor' && board[k][i].length > 2) {
            if (board[k][i][2].hint === this.props.currentPlayer || board[k][i][1].hint === this.props.currentPlayer) {
              mapData.push(<div className="map my-tile one wide column" data-tip={`${board[k][i][2].hint} / ${board[k][i][1].hint}`} data-for="tile" >
                             <img src={pictures[board[k][i][1].sprite]} alt='' className="board-item" onClick={()=>this.props.onClick(i,k)}/>
                             <img src={pictures[board[k][i][2].sprite]} alt='' className="board-item" onClick={()=>this.props.onClick(i,k)}/>
                           </div>);
            } else {
              mapData.push(<div className="map tile one wide column" data-tip={`${board[k][i][2].hint} / ${board[k][i][1].hint}`} data-for="tile" >
                             <img src={pictures[board[k][i][1].sprite]} alt='' className="board-item" onClick={()=>this.props.onClick(i,k)}/>
                             <img src={pictures[board[k][i][2].sprite]} alt='' className="board-item" onClick={()=>this.props.onClick(i,k)}/>
                           </div>);
            }
          } else if ( this.props.currentPlayer && (board[k][i][1].hint === this.props.currentPlayer || board[k][i][0].hint === this.props.currentPlayer)) {
            mapData.push(<div className="map my-tile one wide column" data-tip={`${board[k][i][1].hint}`} data-for="tile" >
                           <img src={pictures[board[k][i][0].sprite]} alt='' className="board-item" onClick={()=>this.props.onClick(i,k)}/>
                           <img src={pictures[board[k][i][1].sprite]} alt='' className="board-item" onClick={()=>this.props.onClick(i,k)}/>
                         </div>);
          } else {
            mapData.push(<div className="map tile one wide column" data-tip={`${board[k][i][1].hint}`} data-for="tile" >
                           <img src={pictures[board[k][i][0].sprite]} alt='' className="board-item" onClick={()=>this.props.onClick(i,k)}/>
                           <img src={pictures[board[k][i][1].sprite]} alt='' className="board-item" onClick={()=>this.props.onClick(i,k)}/>
                         </div>);
          }
        }
      }

      for (let i=0; i<16; i++) {
        if (i !== 0) {
         mapData.push(<div className="map one wide column" >
                        {i}
                      </div>);
       } else {
         mapData.push(<div className="map one wide column">
                        <div className="timer">{this.getTime()}</div>
                      </div>);
       }
      }

      mapData.push(<ReactTooltip id="tile" effect="solid" getContent={(dataTip) => `${dataTip}`}/>);
    }

    return(
      <div className="ui grid">
        {mapData}
        <VictoryModal isOpen={this.props.showVictoryModal} stayOnPage={this.props.stayOnPage}/>
      </div>
    )
  }
}

export default GameInfo;
