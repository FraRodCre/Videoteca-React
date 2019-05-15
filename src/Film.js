import React, { Component } from 'react'
import './Film.css'

const DOMAIN_URL_IMAGE = 'https://image.tmdb.org/t/p/w200';

class Film extends Component {
    render() {
        const { details } = this.props
        return (
            <div className="film">
                {
                    <img src={DOMAIN_URL_IMAGE + details.poster_path} alt={details.title} className="film__poster" />
                }
                <h1 className="film__title" ><span>{details.title}</span></h1>
                <p className="film__rating">Rating: {details.vote_average}<img className="film__start" src="/star.svg" alt="estrellas"/></p>
            </div>
        )
    }
}

export default Film