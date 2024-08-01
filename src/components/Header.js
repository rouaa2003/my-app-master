import React from 'react';
import './Header.css';

function Header({ isChatOpen }) {
  return (
    <header id="header" style={{ width: isChatOpen ? '65%' : '100%' }}>
      <h1 className='h'>Welcome to the Blue Market</h1>
      <p className='h-p'>Buy and sell used products easily</p>
    </header>
  );
}

export default Header;

