import React, { Component } from 'react'

import Film from './Film'
import Stars from './Stars'
import VideotecaContext from './VideotecaContext'

import './FilmDetail.css'

const DOMAIN_URL_IMAGE = 'https://image.tmdb.org/t/p/w1280';

class FilmDetail extends Component {

    state = { loading: true, idFilm: this.props.match.params.id, film: {}, collections: [], filmInCollections: [], stars: -1 }


    async componentDidMount() {
        try {
            const result = await this.props.getDiscoverFilmByID(this.state.idFilm)
            this.setState({
                film: result,
                collections: this.props.getCollections(),
                stars: this.props.getRating(result),
                filmInCollections: this.props.getCollectionsForFilm(result.id)
            })

        } catch (error) {
            this.setState({ error: true })
        } finally {
            this.setState({ loading: false })
        }
    }

    render() {
        const { film, loading, error, collections, filmInCollections, stars } = this.state
        const allCollections = collections.map(collection => collection.name)
        const availableCollections = allCollections.filter(collection => !filmInCollections.includes(collection))

        if (loading) {
            return <p className="message">Cargando...</p>
        }

        if (error) {
            return <p className="message">Error al carga la película</p>
        }

        return (
            <div className='detail'>
                <div className="detail__header" style={{ backgroundImage: `url(${DOMAIN_URL_IMAGE + film.backdrop_path})` }}>
                    <h1 className="detail__titleHeader" ><span>{film.title}</span></h1>
                </div>
                <div className='detail__filmSection'>
                    <div className='detail__film'>
                        <div className="detail__rating">
                            <label>
                                Calificar:
        <select onChange={this.setRating.bind(this)} className="detail__ratingSelector" value={stars}>
                                    <option value="-1">Valorar</option>
                                    <option value="0">0 estrellas</option>
                                    <option value="1">1 estrella</option>
                                    <option value="2">2 estrellas</option>
                                    <option value="3">3 estrellas</option>
                                    <option value="4">4 estrellas</option>
                                    <option value="5">5 estrellas</option>
                                </select>
                            </label>
                        </div>
                        <Stars stars={stars} id={film.id} />
                        <Film details={film} />
                    </div>
                    {
                        (!collections || collections.length === 0) &&
                        <p className="message">No existen colecciones. ¿<a href="/collections">Desear crear una</a>?</p>
                    }
                    {
                        filmInCollections && filmInCollections.length > 0 &&
                        <>
                            <dt className="film__details__itemtitle">Guardada en</dt>
                            <dd className="film__details__item">
                                {
                                    <ul className="film__collections">
                                        {
                                            filmInCollections.map(collection =>
                                                <li key={collection} className="collection__item">
                                                    <label className="collection__label">
                                                        <button onClick={() => this.removeFilmFromCollection(collection)} className="detail__buttonAddRemove">-</button>
                                                        {collection}
                                                    </label>
                                                </li>
                                            )
                                        }
                                    </ul>
                                }
                            </dd>
                        </>
                    }
                    {
                        availableCollections && availableCollections.length > 0 &&
                        <>
                            <dt className="film__details__itemtitle">Colecciones disponibles</dt>
                            <dd className="film__details__item">
                                {
                                    <ul className="film__collections">
                                        {
                                            availableCollections.map(collection =>
                                                <li key={collection} className="collection__item">
                                                    <label className="collection__label">
                                                        <button onClick={() => this.addFilmToCollection(collection)} className="detail__buttonAddRemove">+</button>
                                                        {collection}
                                                    </label>
                                                </li>
                                            )
                                        }
                                    </ul>
                                }
                            </dd>
                        </>
                    }

                    {
                        film.overview &&
                        <>
                            <dt className="film__details__itemtitle">Resumen</dt>
                            <dd className="film__details__item">{film.overview}</dd>
                        </>
                    }
                    {
                        film.genre_list &&
                        <>
                            <dt className="film__details__itemtitle">Género</dt>
                            <dd className="film__details__item">{film.genre_list}</dd>
                        </>
                    }
                    {
                        film.release_date &&
                        <>
                            <dt className="film__details__itemtitle">Estreno</dt>
                            <dd className="film__details__item">{film.release_date}</dd>
                        </>
                    }
                    {
                        film.runtime &&
                        <>
                            <dt className="film__details__itemtitle">Duración</dt>
                            <dd className="film__details__item">{film.runtime} minutos</dd>
                        </>
                    }
                </div>
            </div>

        )
    }

    addFilmToCollection(col) {
        this.setState({
            filmInCollections: this.props.addFilmToCollection(col, this.state.film)
        })
    }

    removeFilmFromCollection(col) {
        this.setState({
            filmInCollections: this.props.removeFilmFromCollection(col, this.state.film, true)
        })
    }

    setRating(event) {
        this.setState({
            stars: this.props.setRating(this.state.film, event.target.value)
        })
    }
}

export default props =>
    <VideotecaContext.Consumer>
        {
            ({ getDiscoverFilmByID, addFilmToCollection, removeFilmFromCollection, getCollections, getCollectionsForFilm, getRating, setRating }) =>
                <FilmDetail {...props}
                    getDiscoverFilmByID={getDiscoverFilmByID}
                    getCollections={getCollections}
                    addFilmToCollection={addFilmToCollection}
                    removeFilmFromCollection={removeFilmFromCollection}
                    getCollectionsForFilm={getCollectionsForFilm}
                    getRating={getRating}
                    setRating={setRating} />
        }
    </VideotecaContext.Consumer>