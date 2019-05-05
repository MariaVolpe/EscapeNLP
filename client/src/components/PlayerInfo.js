import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import pic from '../images/yellow.png';
import '../styles/PlayerInfo.css';

class PlayerInfo extends Component {

  render() {
    const itemsList = Object.entries(this.props.playerInfo.inventory);

    const items = itemsList.map((item, i) => <div className="item-slot" key={i} data-tip={`${itemsList[i][0]}`} data-for="inv">
                                               <div className="item-outline">
                                                <img src={pic} alt='item' className="item-pic" />
                                               </div>
                                             </div>);
    items.push(<ReactTooltip id="inv" effect="solid" getContent={(dataTip) => `${dataTip}`}/>);
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
      return(
        <div className="card player-box">
          <div className="content">
            <img
              className="left floated mini ui image"
              src="https://banner2.kisspng.com/20180828/sxw/kisspng-clip-art-computer-icons-user-download-chamber-of-d-talonpaw-svg-png-icon-free-download-175238-on-5b84c95a116717.2809616615354289540713.jpg"
              alt="user icon"
            />

            <div className="right floated ui header">
              {this.props.playerInfo.name}
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
