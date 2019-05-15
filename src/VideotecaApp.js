import React from 'react'
import Routes from './Routes'
import Nav from './Nav'
import VideotecaContext from './VideotecaContext'

const API_KEY = 'your api key'
const URL_DISCOVER_FILMS = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc&include_adult=false&include_video=false&page=`
const URL_FILM = `https://api.themoviedb.org/3/movie/ID_MOVIE?api_key=${API_KEY}&language=es-ES`
const URL_SEARCH = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&page=1&include_adult=false&query=QUERY`

export default class extends React.Component {

    render() {

        return (
            <VideotecaContext.Provider value={{
                getDiscoverFilms: this.getDiscoverFilms,
                getDiscoverFilmByID: this.getDiscoverFilmByID,
                searchFilms: this.searchFilms,
                getCollections: this.getCollections,
                createCollection: this.createCollection,
                renameCollection: this.renameCollection,
                getFilmsFromCollection: this.getFilmsFromCollection,
                getCollectionsForFilm: this.getCollectionsForFilm,
                removeCollection: this.removeCollection,
                addFilmToCollection: this.addFilmToCollection,
                removeFilmFromCollection: this.removeFilmFromCollection,
                getRating: this.getRating,
                setRating: this.setRating
            }}>
                <Nav />
                <Routes />
            </VideotecaContext.Provider>
        )
    }

    // Get films from the API
    getDiscoverFilms = async () => {
        const response = await fetch(URL_DISCOVER_FILMS)
        const { results } = await response.json()
        return results
    }

    getDiscoverFilmByID = async (idFilm) => {
        const response = await fetch(URL_FILM.replace('ID_MOVIE', idFilm))
        const results = await response.json()
        return results
    }

    searchFilms = async (query, page) => {
        const url = URL_SEARCH.replace('QUERY', encodeURI(query)).replace('PAGE', page)
        const response = await fetch(url)
        const { results, total_pages } = await response.json()
        const films = results.map(item => {
            return item
        })
        return { films, total_pages, page }
    }

    // Local Storage
    getCollections = () => {
        const collections = JSON.parse(localStorage.getItem("collections")) || {}
        let collection = []
        Object.keys(collections).forEach(key => {
            collection.push({
                name: key,
                movies_count: collections[key].length
            })
        })
        return collection
    }

    createCollection = (name) => {
        const collections = JSON.parse(localStorage.getItem("collections")) || {}
        while (collections[name]) {
            name = `${name}`
        }
        collections[name] = []
        localStorage.setItem("collections", JSON.stringify(collections))
        return this.getCollections()
    }

    renameCollection(currentName, newName) {
        const collections = JSON.parse(localStorage.getItem("collections")) || {}
        if (currentName !== newName) {
            while (collections[newName]) {
                newName = `${newName}`
            }
            collections[newName] = collections[currentName]
            delete collections[currentName]
            localStorage.setItem("collections", JSON.stringify(collections))
        }
        return newName
    }

    removeCollection(name) {
        const collections = JSON.parse(localStorage.getItem("collections")) || {}
        if (collections[name]) delete collections[name]
        localStorage.setItem("collections", JSON.stringify(collections))
    }

    getFilmsFromCollection(colection) {
        const colections = JSON.parse(localStorage.getItem("collections")) || {}
        const films = colections[colection] || {}
        return films
    }

    getCollectionsForFilm(id) {
        const collections = JSON.parse(localStorage.getItem("collections")) || {}
        let collection = []
        Object.keys(collections).forEach(key => {
            let found = false
            collections[key].forEach(film => {
                if (film.id === id) {
                    found = true
                }
            })
            if (found) {
                collection.push(key)
            }
        })
        return collection
    }

    // Collections
    addFilmToCollection(collection, film) {
        const collections = JSON.parse(localStorage.getItem("collections")) || {}
        collections[collection].push(film)
        collections[collection] = collections[collection].sort((a, b) => {
            if (a.title > b.title) return 1
            if (a.title < b.title) return -1
            return 0
        })
        localStorage.setItem("collections", JSON.stringify(collections))
        return this.getCollectionsForFilm(film.id)
    }

    removeFilmFromCollection(collection, film, returnCollections = false) {
        const collections = JSON.parse(localStorage.getItem("collections")) || {}
        collections[collection] = collections[collection].filter(item => (film.id !== item.id))
        localStorage.setItem("collections", JSON.stringify(collections))
        if (returnCollections) return this.getCollectionsForFilm(film.id)
    }

    // Rating
    getRating(film) {
        const starsData = JSON.parse(localStorage.getItem("stars")) || {}
        const stars = starsData[film.id]
        if (stars) {
            return stars
        } else {
            return -1
        }
    }

    setRating(film, stars) {
        const starsData = JSON.parse(localStorage.getItem("stars")) || {}
        starsData[film.id] = parseInt(stars)
        localStorage.setItem("stars", JSON.stringify(starsData))
        return stars
    }
}