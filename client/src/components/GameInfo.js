import React, { Component } from 'react';
import '../styles/GameInfo.css';
import image from '../images/player.png'

class GameInfo extends Component {



  render() {
    const ready = this.props.allPlayersReady;
    const map = this.props.map;
    let mapData = [];

    if (ready) {
      map.forEach((row, i) => {
        row.forEach((element, k) => {
          if (k === 0) {
            mapData.push(<div className="map one wide column" >
                           {String.fromCharCode(i+65)}
                         </div>);
          } else if (i === 12) {
            mapData.push(<div className="map one wide column" >
                           {k}
                         </div>);
          } else {
            mapData.push(<div className="map tile one wide column" >
                           <img src={image} className="item" />
                         </div>);
          }
        });
      });
    }
    else {
      map.forEach((row, i) => {
        row.forEach((element, k) => {
          if (k === 0 && i < 12) {
            mapData.push(<div className="map one wide column" >
                           {String.fromCharCode(i+65)}
                         </div>);
          } else if (i === 12) {
            mapData.push(<div className="map one wide column" >
                           {k}
                         </div>);
          } else {
            mapData.push(<div className="map tile one wide column" >
                           <img src={image} className="item" />
                         </div>);
          }
        });
      });
    }

    return(
      <div className="ui grid">
        {mapData}
      </div>
    )
  }
}

export default GameInfo;
