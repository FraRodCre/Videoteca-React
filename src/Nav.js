import React from 'react'
import { NavLink } from 'react-router-dom'

import './Nav.css'

export default props =>
  <nav className='menu'>
    <ul className='menu__options'>
    <h1 className='menu__nameApp'><a href="/">Videoteca</a></h1>
      <li className='menu__option'>
        <NavLink exact activeClassName='menu__link--active' className='menu__link' to='/'>Películas</NavLink>
      </li>
      <li className='menu__option'>
        <NavLink activeClassName='menu__link--active' className='menu__link' to='/collections'>Coleccciones</NavLink>
      </li>
      <li className='menu__option'>
        <NavLink activeClassName='menu__link--active' className='menu__link' to='/search'>Buscar</NavLink>
      </li>
    </ul>
  </nav>