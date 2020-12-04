import React, {FC, useEffect, useState} from 'react';
import { Switch, Route, useHistory } from 'react-router-dom'
import AuthForm from "../auth-form";
import RegisterForm from "../register-form";

interface IAuthContainer {
    onAuthFormSubmit(email: string, password: string): void,
    onRegistrationFormSubmit(name: string, email: string, password: string): void,
}

const AuthContainer: FC<IAuthContainer> = ({onAuthFormSubmit, onRegistrationFormSubmit}) => {
    
    return (
        <Switch>
            <Route 
                render={(props) => <AuthForm 
                    {...props} 
                    onSubmit={onAuthFormSubmit} 
                />} 
                path="/" 
                exact
            />
            <Route 
                render={(props) => <RegisterForm 
                    {...props}
                    onSubmit={onRegistrationFormSubmit}
                    />}
                path="/registration" 
            />
        </Switch>
    )
}

export default AuthContainer;