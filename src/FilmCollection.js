import React, { Component } from 'react'
import { Link } from 'react-router-dom'


import Showcase from './Showcase'
import Film from './Film'
import VideotecaContext from './VideotecaContext'
import './FilmCollection.css'

class FilmCollecion extends Component {
    state = { films: [], name: '', deleting: false, renaming: false }

    componentDidMount() {
        this.setState({
            name: this.props.match.params.name,
            films: this.props.getFilmsFromCollection(this.props.match.params.name)
        })
    }

    render() {
        const { films, name, deleting, renaming } = this.state

        return (
            <>
                <h1 className="collection__title">{this.props.match.params.name}</h1>
                <form className="manage__collections" onSubmit={event => event.preventDefault()}>
                    <button className='collection__buttonAceptCancel' onClick={this.renameCollection.bind(this)}>Renombrar colección</button>
                    <button className='collection__buttonAceptCancel' onClick={this.removeCollection.bind(this)}>Borrar colección</button>
                    {
                        renaming &&
                        <>
                            <input type="text" placeholder="Nombre de la colección" onChange={this.updateName.bind(this)} className="collection__name" value={name} />
                            <p>
                                <button className='collection__buttonAceptCancel' onClick={this.confirmRenameCollection.bind(this)}>Aceptar</button>
                                <button className='collection__buttonAceptCancel' onClick={this.cancelAction.bind(this)}>Cancelar</button>
                            </p>
                        </>
                    }
                    {
                        deleting &&
                        <>
                            <p>Vas a eliminar la colección y sus pelícuas. ¿Estás seguro?</p>
                            <p>
                                <button className='collection__buttonAceptCancel' onClick={this.confirmDeleteCollection.bind(this)}>Aceptar</button>
                                <button className='collection__buttonAceptCancel' onClick={this.cancelAction.bind(this)}>Cancelar</button>
                            </p>
                        </>
                    }
                </form>
                {
                    (!films || films.length === 0) &&
                    <p className="message">No hay películas en la colección.</p>
                }
                {
                    films && films.length > 0 &&
                    <Showcase keyFn={film => film.id} items={films} render={film =>
                        <>
                            <button onClick={this.removeFilm.bind(this, film) } className="remove__film">&times;</button>
                            <Link to={`/film/${film.id}`}>
                                <Film details={film} stars={this.props.getRating(film)} />
                            </Link>
                        </>
                    } />
                }
            </>
        )
    }

    removeFilm(film) {
        this.props.removeFilmFromCollection(this.props.match.params.name, film)
        this.setState({
            films: this.props.getFilmsFromCollection(this.props.match.params.name)
        })
    }

    updateName(event) {
        this.setState({
            name: event.target.value
        })
    }

    renameCollection(event) {
        event.preventDefault()
        this.setState({
            renaming: !this.state.renaming
        })
    }

    confirmRenameCollection() {
        window.location = this.props.renameCollection(this.props.match.params.name, this.state.name)
    }

    removeCollection(event) {
        event.preventDefault()
        this.setState({
            deleting: !this.state.deleting
        })
    }

    confirmDeleteCollection() {
        this.props.removeCollection(this.props.match.params.name)
        window.location = '/collections'
    }

    cancelAction() {
        this.setState({
            deleting: false,
            renaming: false
        })
    }
}

export default props =>
    <VideotecaContext.Consumer>
        {
            ({ renameCollection, removeCollection, getFilmsFromCollection, removeFilmFromCollection, getRating }) =>
                <FilmCollecion {...props}
                    renameCollection={renameCollection}
                    removeCollection={removeCollection}
                    getFilmsFromCollection={getFilmsFromCollection}
                    removeFilmFromCollection={removeFilmFromCollection}
                    getRating={getRating} />
        }
    </VideotecaContext.Consumer>