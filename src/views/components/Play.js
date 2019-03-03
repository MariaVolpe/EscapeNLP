import React, { Component } from 'react';
import { Button } from 'reactstrap';
import AbandonButon from './AbandonButton.js';
import PlayerInfo from './PlayerInfo.js';
import GameInfo from './GameInfo.js';
import TextInfo from './TextInfo.js';
import './Play.css';

class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerInfo: {
        name: "Nicky Cen",
        inventory: {
          key: "doorKey",
          weapon: "sword"
        },
        picture: "[pic]"
      },
      map: []
    }
  }

  componentDidMount() {
    //not working
    const map = new Array(9).fill(0).map(() => new Array(9).fill(0));
    this.setState({
      map: map
    });
  }

  render() {
    const map = new Array(9).fill(0).map(() => new Array(9).fill(0));

    return(
      <div>
        <div className='player-info'>
          Player Info
          <PlayerInfo playerInfo={this.state.playerInfo} />
        </div>
        <div className='game-info'>
          map view
          <GameInfo map={map}/>
        </div>
        <div className='text-info'>
          text and stuff
          <TextInfo/>
          <AbandonButon/>
        </div>
      </div>
    )
  }
}

export default Play;
