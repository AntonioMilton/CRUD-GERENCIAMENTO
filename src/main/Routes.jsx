import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/Home'
import UserCrud from '../components/user/UserCrud'
import Estoque from '../components/estoque/Estoque'

export default props => 
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/users' component={UserCrud} />
        <Route path='/estoque' component={Estoque} />
        <Redirect from='*' to='/' />
    </Switch>