import React from 'react';
import Navigation from './Navigation';
import '../styles/HowTo.css';

class HowTo extends React.Component {
  render(){
    return (
      <div>
        <Navigation />
          <h1>How to Play EscapeNLP</h1>
          <br /><br />
          <h2>What is EscapeNLP?</h2>
          <div class="ui divider" style={{marginLeft: '25%', marginRight: '25%'}}></div>
          <p style={{marginLeft: '25%', marginRight: '25%'}}>
            EscapeNLP is a freeform multiplayer text-based escape room web game. Players (at most 5) 
            are placed in a virtual environment where they must collaborate to solve puzzles through 
            written intentions. Intentions are processed and classified by a natural language 
            interpreter which then alters the state of the game. With the usage of natural language 
            processing (or NLP), players will be able to focus on the game, rather than memorizing commands.
          </p>
          <h2>Who can we play EscapeNLP with?</h2>
          <div class="ui divider" style={{marginLeft: '25%', marginRight: '25%'}}></div>
          <p style={{marginLeft: '25%', marginRight: '25%'}}>
            You can either play alone or in a team of up to 5 players.
          </p>
          <h2>Rules</h2>
          <div class="ui divider" style={{marginLeft: '25%', marginRight: '25%'}}></div>
          <p>
            
          </p>


      </div>
    );
  }
}

export default HowTo;