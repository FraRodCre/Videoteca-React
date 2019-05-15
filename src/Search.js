import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { debounce } from 'throttle-debounce'

import Showcase from './Showcase'
import Film from './Film'
import VideotecaContext from './VideotecaContext'
import './Search.css'

class Search extends Component {
    state = { 
        films: [], 
        query: '', 
        page: 1, 
        total_pages: 1, 
        loading: false, 
        error: false
    }

    searchFilmsDebounced = debounce(500, this.searchFilms)

    render() {
        const { films, query, loading, error } = this.state

        return (
            <>
                <form className="search" onSubmit={event => event.preventDefault()}>
                    <input type="text" placeholder="Buscar pelicula" onChange={ this.searchNewFilms.bind(this) } className="search__bar" />
                </form>
                {
                    loading &&
                    <p className="message">Cargando...</p>
                }
                {
                    error &&
                    <p className="message">¡Error!</p>
                }
                {
                    !loading && query !== '' && films.length === 0 &&
                    <p className="message">No hay resultados</p>
                }
                {
                    !loading && films.length > 0 &&
                    <Showcase keyFn={film => film.id} items={films} render={film =>
                        <Link to={`/film/${film.id}`}>
                            <Film details={film} />
                        </Link>
                    } />
                }
            </>
        )
    }

    async searchNewFilms(event) {
        this.searchFilmsDebounced(event.target.value, 1)
    }

    async searchFilms(query, p) {
        if (query.trim() === '') {
            this.setState({
                films: [],
                query: '',
                page: 1,
                total_pages: 1,
                loading: false,
                error: false
            })
        } else {
            this.setState({ loading: true })
            try {
                const { films, total_pages, page } = await this.props.searchFilms(query, p)
                this.setState({ films, query, page, total_pages })
            } catch (error) {
                this.setState({ error: true })
            } finally {
                this.setState({ loading: false })
            }
        }
    }
}

export default props =>
    <VideotecaContext.Consumer>
        {
            ({ searchFilms }) =>
                <Search {...props}
                searchFilms={ searchFilms } />
        }
    </VideotecaContext.Consumer>