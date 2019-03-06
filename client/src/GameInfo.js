import React, { Component } from 'react';
import { Input } from 'reactstrap';
import './GameInfo.css';

class GameInfo extends Component {

  render() {

    const map = this.props.map;
    let i = 0;
    let mapData = [];

    map.forEach((row) => {
      mapData[i] = row.map((element, i) =>
        <div className="map col-1" key={i}>
          <a className="map-point">{i}</a>
        </div>
      );
      i++;
    });
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
