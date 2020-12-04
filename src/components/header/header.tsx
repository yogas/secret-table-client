import React, {FC, useCallback, useContext} from 'react';
import {NavLink} from "react-router-dom";
import './header.css';
import logo from './logo.svg';

interface IUser {
    id: string,
    name: string,
    email: string
}

interface IHeader {
    auth?: boolean,
    user?: IUser
}

const Header: FC<IHeader> = ({auth, user}) => {
    const onLogout = useCallback( (e) => {
        e.preventDefault();
        window.localStorage.setItem('jwt', '');
        document.location.href = '/';
    }, []);
    
    let userMenu = (
        <React.Fragment>
            <li><NavLink to="/">Sign In</NavLink></li>
            <li><NavLink to="/registration">Register</NavLink></li>
        </React.Fragment>
    );
    
    if(auth) userMenu = (
        <React.Fragment>
            <li><NavLink to="/create">Create table</NavLink></li>
            <li><NavLink to="/tables">My tables</NavLink></li>
            <li>{user?.name} ({user?.email})</li>
            <li><a href="/logout" onClick={onLogout}><i className="material-icons">exit_to_app</i></a></li>
        </React.Fragment>
    );
    
    return (
        <nav className="header light-blue darken-4">
            <div className="nav-wrapper">
                <a href="/" className="brand-logo"><img src={logo} width="25" /></a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {userMenu}
                </ul>
            </div>
        </nav>
    )
}

export default Header;