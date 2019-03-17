import React, { Component } from 'react';
<<<<<<< HEAD:client/src/GameInfo.js
import './GameInfo.css';
=======
import { Input } from 'reactstrap';
import '../styles/GameInfo.css';
>>>>>>> d5483488e454366dc1bbd43eeb8b4966562f39ea:client/src/components/GameInfo.js

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
            <a className="map-point">{i}</a>
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

    console.log(mapData);

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
