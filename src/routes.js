import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import Logon from './pages/Logon';
import Insumos from './pages/Insumos';

export default function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Logon} />
                <Route path="/insumos" exact component={Insumos} />
            </Switch>
        </BrowserRouter>
    )
}