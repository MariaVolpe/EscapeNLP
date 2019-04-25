import React, { Component } from 'react';
import '../styles/PlayerInfo.css';

class PlayerInfo extends Component {

  responsiveColumns = (length) => {
    let colSize = Math.floor(12/(length));
    if (colSize > 5) {
      colSize = 5;
    }
    return colSize;
  }

  render() {
    const itemsList = Object.entries(this.props.playerInfo.inventory);
    let numOfCols = (this.responsiveColumns(itemsList.length)).toString();
    console.log(numOfCols);
    let columns = "col-" + numOfCols + " ui item mini button";

    const items = itemsList.map((item, i) => <div className={columns} key={i}>
                                            {itemsList[i][1]}
                                          </div>)

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
            src="https://openclipart.org/download/247324/abstract-user-flat-1.svg"
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
