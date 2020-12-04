import React, {FC, FormEvent, ChangeEvent, useCallback, useState} from 'react';
import './auth-form.css';
import {NavLink} from "react-router-dom";

interface IAuthForm {
    onSubmit(email: string, password: string): void
}

const AuthForm: FC<IAuthForm> = ({onSubmit}) => {
    const [fields, setFields] = useState({
        email: '',
        password: ''
    });
    
    const onInput = useCallback( (id: string, value: string) => {
        setFields(prev => ({
            ...prev,
            [id]: value
        }));
    }, []);
    
    const onSubmitHandler = useCallback((e: FormEvent) => {
        e.preventDefault();
        onSubmit(fields.email, fields.password);
    },[fields]);
    
    return (
        <form className="auth-form" onSubmit={onSubmitHandler}>
            <h1>Auth</h1>
            <div className="input-field col s12">
                <input 
                    onInput={(e: ChangeEvent<HTMLInputElement>) => onInput('email', e.target.value)} 
                    id="email" 
                    type="email" 
                    placeholder="Email" 
                    value={fields.email}
                />
            </div>
            <div className="input-field col s12">
                <input
                    onInput={(e: ChangeEvent<HTMLInputElement>) => onInput('password', e.target.value)}
                    id="pwd" 
                    type="password" 
                    placeholder="Password" 
                />
            </div>
            <div className="auth-form__bottom">
                <NavLink to="/registration">Registration</NavLink>
            </div>
            <button type="submit" className="waves-effect waves-light btn-large auth-form__submit-btn">Login</button>
        </form>
    )
}

export default AuthForm;