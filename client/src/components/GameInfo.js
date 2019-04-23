import React, { Component } from 'react';
import '../styles/GameInfo.css';
import image from '../images/player.png'

class GameInfo extends Component {

  render() {

    const ready = this.props.allPlayersReady;

    const map = this.props.map;
    let i = 0;
    let mapData = [];
    map.forEach((row) => {
      mapData[i] = row.map((element, i) =>
        <div className="map one wide column" key={i}>
          <img src={image} className="item" />
        </div>
      );
      i++;
    });

    var visibleMap;
    let hiddenMap = [];

    if (ready) {
      visibleMap = mapData;
    }
    else {
      i = 0;
      map.forEach((row) => {
        hiddenMap[i] = row.map((element, i) =>
          <div className="map one wide column" key={i}>
            <img src={image} className="item" />
          </div>
        );
        i++;
      });
      visibleMap = hiddenMap;
    }

    return(
      <div className="ui grid">
        {visibleMap}
      </div>
    )
  }
}

export default GameInfo;
