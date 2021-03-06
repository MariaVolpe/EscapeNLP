import React from 'react';
import Navigation from './Navigation';
import '../styles/HowTo.css';

class HowTo extends React.Component {
  render(){
    return (
      <div className="colors">
        <Navigation inGame={false}/>
          <div className="App-header" style={{backgroundColor: '#283942'}}>
            <h1 className="title">How to Play EscapeNLP</h1>
            <h2 className="title">What is EscapeNLP?</h2>
            <p>
              EscapeNLP is a freeform multiplayer text-based escape room web game. Players (at most 5)
              are placed in a virtual environment where they must collaborate to solve puzzles through
              written intentions. Intentions are processed and classified by a natural language
              interpreter which then alters the state of the game. With the usage of natural language
              processing (or NLP), players will be able to focus on the game, rather than memorizing commands.
            </p>
            <h2 className="title">Who can I play EscapeNLP with?</h2>
            <p>
              You can play with up to 5 players. Anybody is allowed to join a lobby as long as
              it is not full.
            </p>
            <h2 className="title">Rules</h2>
            <p>
              Once you reach the play screen, the game will start if and only if every player in the
              lobby say that they are ready. Once the game begins, you are able to either chat with
              the other players in the game or if its your turn you type in your action. The most important
              thing of them all is to...
            </p>
            <h1>Have fun!</h1>
          </div>
      </div>
    );
  }
}

export default HowTo;
