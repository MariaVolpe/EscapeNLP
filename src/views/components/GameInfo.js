import React, { Component } from 'react';
import './GameInfo.css';

class GameInfo extends Component {

  render() {

    const map = this.props.map;
    let i = 0;
    let mapData = [];

    map.forEach((row) => {
      mapData[i] = row.map((element, i) =>
        <div className="map" key={i}>
          <a className="map-point">{i}</a>
        </div>
      );
      i++;
    });
    console.log(mapData);

    // const map = this.props.map.map((row, i) =>
    //   <div className="row">
    //     {row}
    //   </div>
    // );


    return(
      <div>
        <div className="left-space">-</div>
        <div className="map-space">
          {mapData}
        </div>
        <div className="right-space">-</div>
      </div>
    )
  }
}

export default GameInfo;
