import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav } from 'reactstrap';
import '../styles/Browser.css';

class Navigation extends Component {

  render() {
    return (
      <div>
        <Navbar color="danger">
          <Nav />
          <NavbarBrand href='/' style={{color: 'white'}}>EscapeNLP</NavbarBrand>
          <Nav />
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
