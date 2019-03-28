import React, { Component } from 'react';
import '../styles/GameInfo.css';

class GameInfo extends Component {

  render() {

    const ready = this.props.allPlayersReady;

    const map = this.props.map;
    let i = 0;
    let mapData = [];

    if (ready) {
      map.forEach((row) => {
        mapData[i] = row.map((element, i) =>
          <div className="map col-1" key={i}>
            {i}
          </div>
        );
        i++;
      });
    }
    else {
      for (let i=0; i<5; i++) {
        mapData[i] = <div className="col-12">Filter {i}</div>;
      }
    }

    return(
      <div>
        <div>
          {mapData}
        </div>
      </div>
    )
  }
}

export default GameInfo;
