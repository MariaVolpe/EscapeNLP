import React, { Component } from 'react';
import { Button } from 'reactstrap';
import whatIs from '../images/home/whatIs.png';
import whatIsAnswer from '../images/home/whatIsAnswer.jpeg';
import rules from '../images/home/rules.png';
import rulesReveal from '../images/home/rulesReveal.jpg';
import whoCan from '../images/home/whoCan.png';
import whoCanAnswer from '../images/home/whoCanAnswer.jpeg';
import bigRule from '../images/home/bigRule.png';
import bigRuleReveal from '../images/home/bigRuleReveal.jpeg';
import gameboard from '../images/game_board.jpeg';
import '../styles/Home.css';

class Home extends Component {

  constructor(props) {
    super(props);

    this.onPlayClick = this.onPlayClick.bind(this);
    this.onHowToClick = this.onHowToClick.bind(this);
  }

  onPlayClick = (event) => {
    window.location.replace('/browser');
  }

  onHowToClick = (event) => {
    window.location.replace('/howto');
  }

  render() {
    return(
      <div className="background">
        <br />
        <Button
              onClick={this.onPlayClick}
              color="success"
              className="button"
            >
              Find Game
            </Button>
        <h1 style={{marginLeft: '28%', color: 'white'}}>EscapeNLP</h1>

        <div className="App-header" style={{backgroundColor: '#283942'}}>
          <img className="ui huge image" src={gameboard} alt="Game Board" />

          <div className="ui four column grid" >
            <div className="ui instant move reveal">
              <div className="visible content">
                <img
                  src={whatIs}
                  alt="What is EscapeNLP?"
                  className="ui small image"
                  style={{borderRadius: '10px'}}
                />
              </div>
              <div className="hidden content">
                <img
                  src={whatIsAnswer}
                  alt="What is EscapeNLP Reveal"
                  className="ui small image"
                  style={{marginLeft: '10.5%', borderRadius: '10px'}}
                />
              </div>
            </div>
            <div className="ui instant move reveal">
              <div className="visible content">
                <img
                  src={whoCan}
                  alt="Who can play?"
                  className="ui small image"
                  style={{borderRadius: '10px'}}
                />
              </div>
              <div className="hidden content">
                <img
                  src={whoCanAnswer}
                  alt="Who can play reveal"
                  className="ui small image"
                  style={{marginLeft: '10.5%', borderRadius: '10px'}}
                />
              </div>
            </div>
            <div className="ui instant move reveal">
              <div className="visible content">
                <img
                  src={rules}
                  alt="Rules"
                  className="ui small image"
                  style={{borderRadius: '10px'}}
                />
              </div>
              <div className="hidden content">
                <img
                  src={rulesReveal}
                  alt="Rules Reveal"
                  className="ui small image"
                  style={{marginLeft: '10.5%', borderRadius: '14px'}}
                />
              </div>
            </div>
            <div className="ui instant move reveal">
              <div className="visible content">
                <img
                  src={bigRule}
                  alt="Fun"
                  className="ui small image"
                  style={{borderRadius: '10px'}}
                />
              </div>
              <div className="hidden content">
                <img
                  src={bigRuleReveal}
                  alt="Fun Reveal"
                  className="ui small image"
                  style={{marginLeft: '10.5%', borderRadius: '10px'}}
                />
              </div>
            </div>
          </div>
          <p style={{textAlign: 'center', marginBottom: '3%', color: 'white'}}>
            Want More Information?
            <a href="/howto" onClick={this.onHowToClick} className="link"> Click Here </a>
          </p>
        </div>
      </div>
    );
  }
}

export default Home;
