import React from 'react'
import { Switch, Route } from 'react-router'

import Films from './Films'
import FilmDetail from './FilmDetail'
import FilmsCollections from './FilmsCollections'
import FilmCollection from './FilmCollection'
import Search from './Search'


export default () =>
    <Switch>
        <Route exact path='/' component={Films} />
        <Route exact path='/collections' component={FilmsCollections} />
        <Route exact path='/film/:id' component={FilmDetail} />
        <Route exact path='/search' component={Search} />
        <Route exact path='/collection/:name' component={FilmCollection}/>
        <Route component={ () => <p>Error 404, película no encontrada.</p> }/>
    </Switch>