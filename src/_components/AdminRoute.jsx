import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const AdminRoute = ({ component: Component, isAdmin: isAdmin, ...rest }) => (
    <Route {...rest} render={props => (
        isAdmin
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)