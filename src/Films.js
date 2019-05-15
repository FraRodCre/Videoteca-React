import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Showcase from './Showcase'
import Film from './Film'
import VideotecaContext from './VideotecaContext'

class Films extends Component {
  state = { filmsList: [], loading: true }

  async componentDidMount() {
    try {
      const filmsList = await this.props.getDiscoverFilms()
      this.addFilms(filmsList);
    } catch(error) {
      this.setState({ error: true })
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const { filmsList, loading, error } = this.state

    if (error) return <p>Error</p>
    if (loading) return <p>Cargando</p>
    
    return (
      <VideotecaContext.Consumer>
        {
          () =>
          <Showcase keyFn={item => item.id} items={filmsList} render={film => 
            <Link to={`film/${film.id}`}>
            <Film details={film}/>
            </Link>
          }/>
        }
      </VideotecaContext.Consumer>
    );
  }

  addFilms = filmsList => {
    const previousState = this.state
    const newFilms = previousState.filmsList.concat(filmsList);
    const nextState = {
      ...previousState,
      filmsList: newFilms
    }

    this.setState(nextState)
  }
}

export default props =>
<VideotecaContext.Consumer>
    {
        ({ getDiscoverFilms }) =>
            <Films getDiscoverFilms={ getDiscoverFilms } />
    }
</VideotecaContext.Consumer>