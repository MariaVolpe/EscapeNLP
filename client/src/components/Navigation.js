import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav } from 'reactstrap';
import '../styles/Browser.css';

class Navigation extends Component {

  render() {
    return (
      <div>
        <Navbar color="dark">
          <Nav>
            <i className="cog large icon" style={{color: 'white'}}></i>
          </Nav>
          <NavbarBrand href='/' style={{color: 'white'}}>EscapeNLP</NavbarBrand>
          <Nav>
            <i className="bars large icon" style={{color: 'white'}}></i>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
