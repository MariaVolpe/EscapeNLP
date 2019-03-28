import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav } from 'reactstrap';
import '../styles/Browser.css';

class Navigation extends Component {

  render() {
    return (
      <div>
        <Navbar color="dark">
          <Nav>

          </Nav>
          <NavbarBrand href='/'>EscapeNLP</NavbarBrand>
          <Nav>

          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
