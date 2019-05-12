import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import PictureModal from './PictureModal';
import '../styles/Navigation.css';
import '../styles/Browser.css';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  onToggle = (event) => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleSubmit = (event) => {
    this.setState({ isOpen: false });
    event.preventDefault();
  }

  onAvatarClick = (icon) => {
    window.sessionStorage.setItem('playerIcon', icon);
    if (this.props.inGame) {
      this.props.updatePlayerIcon(icon);
    }
    this.setState({ isOpen: false });
  }

  render() {
    if(this.props.inGame === false){
      return (
        <div>
          <Navbar color="danger">
            <Nav/>
            <NavbarBrand href='/' className="navbar">EscapeNLP</NavbarBrand>
            <Nav/>
          </Navbar>
        </div>
      );
    }
    else {
      return (
        <div>
          <Navbar color="danger">
            <Nav>
              <NavItem>
                <PictureModal
                  isOpen={this.state.isOpen}
                  onToggle={this.onToggle}
                  handleSubmit={this.handleSubmit}
                  onAvatarClick={this.onAvatarClick}
                />
                <i onClick={this.onToggle} className="cog icon"/>
              </NavItem>
            </Nav>
            <NavbarBrand className="navbar">EscapeNLP</NavbarBrand>
            <Nav/>
          </Navbar>
        </div>
      );
    }
  }
}

export default Navigation;
