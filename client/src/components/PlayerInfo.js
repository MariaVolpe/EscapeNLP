import React, { Component } from 'react';
import '../styles/PlayerInfo.css';

class PlayerInfo extends Component {

  responsiveColumns = (length) => {
    let colSize = Math.floor(12/(length)-1);
    if (colSize > 5) {
      colSize = 5;
    }
    return colSize;
  }

  render() {
    const itemsList = Object.entries(this.props.playerInfo.inventory);
    let numOfCols = (this.responsiveColumns(itemsList.length)).toString();
    let columns = "col-" + numOfCols + " ui item mini button";

    let items = [];
    console.log(itemsList.length);
    for (let i=0; i<itemsList.length; i++) {
      items.push(<div className={columns}>
                  {itemsList[i][0]}
                 </div>);
    }

    let readyCheck;
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

    // real icon will be decided later, this serves as a temp

    return(
      <div
        className="card player-box"
        style={{borderRadius: '10px', margin: '1%', marginRight: '1%'}}
      >
        <div className="content">
          <img
            className="left floated mini ui image"
            src="https://banner2.kisspng.com/20180828/sxw/kisspng-clip-art-computer-icons-user-download-chamber-of-d-talonpaw-svg-png-icon-free-download-175238-on-5b84c95a116717.2809616615354289540713.jpg"
            alt="user icon"
            style={{marginLeft: '3%', marginTop: '3%'}}
          />
          <div
            className="right floated ui header"
            style={{marginRight: '3%', marginTop: '3%'}}
          >
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

export default PlayerInfo;
