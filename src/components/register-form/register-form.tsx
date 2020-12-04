import React, {ChangeEvent, FC, FormEvent, useCallback, useState} from 'react';
import { NavLink } from 'react-router-dom'
import '../auth-form/auth-form.css';

interface IRegisterForm{
    onSubmit(name: string, email: string, password: string): void
}

const RegisterForm: FC<IRegisterForm> = ({onSubmit}) => {
    const [fields, setFields] = useState({
        name: '',
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
        onSubmit(fields.name, fields.email, fields.password);
    },[fields]);
    
    return (
        <form className="auth-form" onSubmit={onSubmitHandler}>
            <h1>Registration</h1>
            <div className="input-field col s12">
                <input
                    onInput={(e: ChangeEvent<HTMLInputElement>) => onInput('name', e.target.value)}
                    id="name" 
                    type="text" 
                    placeholder="Name" 
                />
            </div>
            <div className="input-field col s12">
                <input
                    onInput={(e: ChangeEvent<HTMLInputElement>) => onInput('email', e.target.value)}
                    id="email" 
                    type="email" 
                    placeholder="Email" 
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
                <NavLink to="/">Auth</NavLink>
            </div>
            <button type="submit" className="waves-effect waves-light btn-large auth-form__submit-btn">Become Agent</button>
        </form>
    )
}

export default RegisterForm;