import React, {FC, MouseEvent} from 'react';
import {NavLink} from "react-router-dom";

const MainNav: FC = () => {
    const onLogout = (e: MouseEvent) => {
        e.preventDefault();
        window.localStorage.setItem('jwt', '');
        document.location.href = '/';
    };
    
    return (
        <React.Fragment>
            <h1>Secret Table</h1>
            
            <ul className="collection">
                <li className="collection-item"><NavLink to="/create">Create table</NavLink></li>
                <li className="collection-item"><NavLink to="/tables">My tables</NavLink></li>
                <li className="collection-item"><a href="/" onClick={onLogout}>Logout</a></li>
            </ul>
        </React.Fragment>
    )
}

export default MainNav;