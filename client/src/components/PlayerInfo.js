import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import '../styles/PlayerInfo.css';
import sword from '../images/sword.png';
import hilt from '../images/hilt.png';
import blade from '../images/blade.png';
import key from '../images/key.png';
import player0 from '../images/p0.png';
import player1 from '../images/p1.png';
import player2 from '../images/p2.png';
import player3 from '../images/p3.png';
import player4 from '../images/p4.png';
import playerDefault from '../images/p5.png';

const pictures = {
  'player1': player0,
  'player2': player1,
  'player3': player2,
  'player4': player3,
  'player5': player4,
  'playerDefault': playerDefault
}

const inventoryIcons = {
  'sword': sword,
  'hilt': hilt,
  'blade': blade,
  'key': key
}

class PlayerInfo extends Component {

  render() {
    const inventory = this.props.playerInfo.inventory;
    let items = [];
    if (inventory !== undefined) {
      items = inventory.map((item, i) => <div className="item-slot" key={i} data-tip={`${item.name}`} data-for="inv">
                                                 <div className="item-outline">
                                                  <img src={inventoryIcons[item.sprite]} alt='' className="item-pic" />
                                                 </div>
                                                 <ReactTooltip key="tooltip" id="inv" effect="solid" getContent={(dataTip) => `${dataTip}`}/>
                                               </div>);
    }

    for (let i = items.length; i < 6; i++) {
      items.push(<div className="item-slot" key={i}>
                   <div className="item-outline">
                    <img src='' alt='' className="item-pic" />
                   </div>
                 </div>);
    }
    const allPlayersReady = this.props.allPlayersReady;
    let readyCheck;

    if (!allPlayersReady) {
      if (this.props.playerInfo.ready === true) {
        readyCheck = <div className="ui disabled checked checkbox">
                        <input type="checkbox" disabled="disabled" checked="checked"/>
                        <label>Ready</label>
                     </div>
      }
      else {
        readyCheck = <div className="ui disabled checked checkbox">
                        <input type="checkbox" disabled="disabled"/>
                        <label>Ready</label>
                     </div>
      }
    }
    const playerNameStyle = "right floated ui header player-name player" + this.props.playerInfo.position;
    const playerIcon = 'player' + this.props.playerInfo.position;

    // real icon will be decided later, this serves as a temp
    if (this.props.playerInfo.hasLeftGame) {
      const name = this.props.playerInfo.name + " has disconnected";
      return(
        <div className="card player-box">
          <div className="content">
            <div className="right floated ui header">
              {name}
            </div>
          </div>
        </div>

      )
    } else {
      let name;
      if (this.props.playerInfo.name === this.props.yourName && this.props.hasSetName) {
        name = this.props.playerInfo.name + ' (you)';
      } else {
        name = this.props.playerInfo.name;
      }
      return(
        <div className="card player-box">
          <div className="content">
            <img
              className="left floated mini ui image"
              src={pictures[playerIcon]}
              alt="user icon"
            />

            <div className={playerNameStyle}>
              {name}
            </div>

          </div>
          <div className="floated ready">{readyCheck}</div>
          <div className="ui horizontal divider inventory" >inventory</div>
          <div className="item-box">
            {items}
          </div>
        </div>

      )
    }


  }
}

export default PlayerInfo;
