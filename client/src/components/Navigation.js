import React, { Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button } from 'reactstrap';
import '../styles/Browser.css';

class Navigation extends Component {

  onBackClick = (event) => {
    window.location.replace('/');
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <Navbar color="dark">
          <Nav>
            <Button onClick={this.onBackClick} className="back-button">{"<<"}</Button>
          </Nav>
          <NavbarBrand href='/'>EscapeNLP</NavbarBrand>
          <Nav>
            <Button>Log-in</Button>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
