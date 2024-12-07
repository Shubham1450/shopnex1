import React, { useState, useContext, useRef } from 'react'
import './Navbar.css'
import logo from '../Assets/shop-logo3.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link, useActionData } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import drop_down from '../Assets/nav_dropdown.png'


const Navbar = () => {
    const { getTotalCartItems } = useContext(ShopContext);
    const [menu, setmenu] = useState("Shop")
    const menuRef = useRef();

    const dropDown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible')
        e.target.classList.toggle('open');
    }
    return (
        <div className="navbar">
            <div className="nav-logo">
                <img src={logo} alt="" />
                <p>SHOPNEX</p>
            </div>
            <img className='nav-dropdown' onClick={dropDown_toggle} src={drop_down} alt="" />
            <ul ref={menuRef} className="nav-menu">
                <li onClick={() => { setmenu("Shop") }}><Link style={{ textDecoration: 'none' }} to='/'>Shop</Link>{menu == "Shop" ? <hr /> : <></>} </li>
                <li onClick={() => { setmenu("Mens") }}><Link style={{ textDecoration: 'none' }} to='/mens'>Mens</Link>{menu == "Mens" ? <hr /> : <></>}</li>
                <li onClick={() => { setmenu("Women") }}><Link style={{ textDecoration: 'none' }} to='/womens'>Women</Link>{menu == "Women" ? <hr /> : <></>}</li>
                <li onClick={() => { setmenu("Kids") }}><Link style={{ textDecoration: 'none' }} to='/kids'>Kid</Link>{menu == "Kids" ? <hr /> : <></>}</li>
                <button className='Theme-Mode'>Mode</button>
            </ul>
            <div className="nav-login-cart">
                {localStorage.getItem('auth-token') ? <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/') }}>Logout</button> : <Link to='/login'><button>Login</button></Link>}
                <Link to='/cart'><img src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    )
}

export default Navbar