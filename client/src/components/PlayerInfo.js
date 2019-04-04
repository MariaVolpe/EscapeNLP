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
      readyCheck = <div className="ui disabled checked checkbox right floated">
                      <input type="checkbox" disabled="disabled"/>
                      <label>Ready</label>
                   </div>
    }

    // real icon will be decided later, this serves as a temp

    return(
      <div className="card player-box">
        <div className="content">
          <img className="left floated mini ui image" src="https://openclipart.org/download/247324/abstract-user-flat-1.svg" alt="user icon"/>
          <div className="right floated ui header">
            {this.props.playerInfo.name}
          </div>

        </div>
        <div className="floated">{readyCheck}</div>
        <div className="ui horizontal divider" >inventory</div>
        <div className="item-box">
          {items}
        </div>
      </div>

    )
  }
}

export default PlayerInfo;
