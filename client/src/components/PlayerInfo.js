import React, { Component } from 'react';
import '../styles/PlayerInfo.css';

class PlayerInfo extends Component {

  render() {
    const itemsList = Object.entries(this.props.playerInfo.inventory);
    const items = itemsList.map((slot, i) =>
      <div className="ui item basic button" key={i}>
        {slot[i]}
      </div>
    );

    var readyCheck;
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

    return(
      <div className="card">
        <div className="content">
          <img className="left floated mini ui image" src="/"/>
          <div className="right floated ui header">
            {this.props.playerInfo.name}
          </div>

        </div>
        <div className="floated">{readyCheck}</div>
        <div className="ui divider"/>
        <div className="extra content">
            {items}
        </div>
        <div className="list"/>
      </div>

    )
  }
}

export default PlayerInfo;
