import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import '../styles/PlayerInfo.css';
import playerIcon from '../images/playericon.png';

class PlayerInfo extends Component {

  render() {
    const inventory = this.props.playerInfo.inventory;
    const itemsList = Object.keys(inventory);

    const items = itemsList.map((item, i) => <div className="item-slot" key={i} data-tip={`${inventory[item]}`} data-for="inv">
                                               <div className="item-outline">
                                                <img src='' alt='' className="item-pic" />
                                               </div>
                                             </div>);
    for (let i = items.length; i < 6; i++) {
      items.push(<div className="item-slot" key={i}>
                   <div className="item-outline">
                    <img src='' alt='' className="item-pic" />
                   </div>
                 </div>);
    }
    items.push(<ReactTooltip key="tooltip" id="inv" effect="solid" getContent={(dataTip) => `${dataTip}`}/>);
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
    const playerCardStyle = "card player-box player" + this.props.playerInfo.position;

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
        name = this.props.playerInfo.name;
      } else {
        name = this.props.playerInfo.name;
      }
      return(
        <div className={playerCardStyle}>
          <div className="content">
            <img
              className="left floated mini ui image"
              src={playerIcon}
              alt="user icon"
            />

            <div className="right floated ui header player-name">
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
