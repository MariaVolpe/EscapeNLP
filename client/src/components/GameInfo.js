import React, { Component } from 'react';
import '../styles/GameInfo.css';

class GameInfo extends Component {

  render() {

    const ready = this.props.allPlayersReady;

    const map = this.props.map;
    let i = 0;
    let mapData = [];
    map.forEach((row) => {
      mapData[i] = row.map((element, i) =>
        <div className="map col-1" key={i}>
          {i}
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
          <div className="map col-1" key={i}>
            !
          </div>
        );
        i++;
      });
      visibleMap = hiddenMap;
    }

    return(
      <div>
        {visibleMap}
      </div>
    )
  }
}

export default GameInfo;
