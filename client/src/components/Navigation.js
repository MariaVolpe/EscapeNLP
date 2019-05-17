import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import '../styles/Navigation.css';
import '../styles/Browser.css';

class Navigation extends Component {
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
            <Nav/>
            <NavbarBrand className="navbar">EscapeNLP</NavbarBrand>
            <Nav/>
          </Navbar>
        </div>
      );
    }
  }
}

export default Navigation;
