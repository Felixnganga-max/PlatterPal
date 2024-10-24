import React from 'react'
import { assets } from '../../assets/assets'
import './Navbar.css'

const Navbar = () => {
  return (
    <div className="navbar">
        <img style = {{height:100, width:100}} src={assets.logo} alt="" className="logo" />
        <img style = {{height:100}} src={assets.profile_image} alt="" className="profile" />
    </div>
  )
}

export default Navbar