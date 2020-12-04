import React, {FC, useCallback, useEffect, useState, createContext} from 'react';
import { useHistory } from 'react-router-dom'
import Header from "../header";
import AuthContainer from "../auth-container";
import TablesContainer from "../tables-container";
import UserContext from "../user-context";
import ApiService from "../../services/api-service";

const api = new ApiService();

const App: FC = () => {
    const history = useHistory();
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState({
        id: '',
        name: '',
        email: ''
    });
    
    useEffect( () => {
        api.checkAuth().then( data => {
            setAuth(data.ok);
            if(data.ok) {
                setUser(data.parsedBody.user);
            }
        });
    }, []);
    
    const onAuthFormSubmit = useCallback( (email:string, password: string) => {
        api.auth(email, password).then( data => {
           if(data.ok) {
               window.localStorage.setItem('jwt', data.parsedBody.token);
               setAuth(true);
               setUser(data.parsedBody.user);
               history.push('/create');
           } else {
               alert(data.parsedBody.msg);
           }
        });
    }, [history]);

    const onRegisterFormSubmit = useCallback( (name: string, email:string, password: string) => {
        api.register(name, email, password).then( data => {
            if(data.ok) {
                window.localStorage.setItem('jwt', data.parsedBody.token);
                setAuth(true);
                setUser(data.parsedBody.user);
                history.push('/create');
            } else {
                alert(data.parsedBody.msg);
            }
        });
    }, [history]);
    
    return (
        <UserContext.Provider value={user}>
            <Header auth={auth} user={user}/>
            <div className="content container">
                {auth ? <TablesContainer/> : <AuthContainer 
                    onAuthFormSubmit={onAuthFormSubmit}
                    onRegistrationFormSubmit={onRegisterFormSubmit}
                />}
            </div>
        </UserContext.Provider>
    )
}

export default App;