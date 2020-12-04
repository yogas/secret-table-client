import React, {FC, useEffect, useState} from 'react';
import { NavLink} from "react-router-dom";
import ApiService from "../../services/api-service";

const api = new ApiService();

interface ITable {
    id: string,
    name: string
}

const appURL: string = 'http://localhost:3000';

const TablesList: FC = () => {    
    const [tables, setTables] = useState<ITable[]>([]);
    
    useEffect( () => {
        api.getAllTables()
            .then( data => {
                setTables(data.parsedBody.tables);
            })
    }, []);
    
    let content = (
        <ul className="collection">
            {tables.map( ({id, name}) => {
                const url: string = `${appURL}/tables/${id}`;
                return (
                    <li key={id} className="collection-item">
                        <NavLink to={`/tables/${id}`}>{name}</NavLink> — {url}
                    </li>
                )
            })}
        </ul>
    );
    
    if(!tables.length) content = <p>Have not tables yet. <NavLink to="/create">Create new one!</NavLink></p>
    
    return (
        <div>
            <h1>My tables</h1>
            {content}
        </div>
    )
}

export default TablesList;