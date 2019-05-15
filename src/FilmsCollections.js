import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import VideotecaContext from './VideotecaContext'
import './FilmsCollections.css'

class FilmsCollections extends Component {
    constructor() {
        super()
        this.state = {
            collections: [],
            name: '',
            existCollection: false
        }
        this.createCollection = this.createCollection.bind(this)
        this.updateNameCollection = this.updateNameCollection.bind(this)
        this.saveCollection = this.saveCollection.bind(this)
        this.cancelAction = this.cancelAction.bind(this)
    }

    componentDidMount() {
        const collections = this.props.getCollections()
        this.setState({ collections })
    }


    render() {
        const { collections, existCollection } = this.state
        return (
            <>
                {
                    (!collections || collections.length === 0) &&
                    <p className="message">No existen colecciones. Si desea crear una colección, pulse sobre el botón "Crear colección".</p>
                }
                <form className="manage__collections" onSubmit={event => {
                    event.preventDefault()
                    this.saveCollection()
                }}>
                    <button className="collections__button" onClick={this.createCollection}>Crear colección</button>
                    {
                        existCollection &&
                        <>
                            <input type="text" placeholder="Nombre de la colección" onChange={this.updateNameCollection} className="collection__name" />
                            <p>
                                <button className='collections__buttonAceptCancel' onClick={this.saveCollection}>Aceptar</button>
                                <button className='collections__buttonAceptCancel' onClick={this.cancelAction}>Cancelar</button>
                            </p>
                        </>
                    }
                </form>
                {
                    
                    collections && collections.length > 0 &&
                    <ul className="collections">
                        {
                            collections.map(item =>
                                <li key={item.name} className='collection__item'>
                                    <Link to={`/collection/${item.name}`} className="collection__link" title={item.name}>
                                    
                                        <span className="collection__item__name">{item.name}</span>
                                        {
                                            item.movies_count === 1 &&
                                            <span className="collection__item__count">1 película</span>
                                        }
                                        {
                                            item.movies_count !== 1 &&
                                            <span className="collection__item__count">{item.movies_count} películas</span>
                                        }
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                }
            </>
        )
    }

    createCollection() {
        this.setState({
            existCollection: !this.state.existCollection
        })
    }

    updateNameCollection(event) {
        this.setState({
            name: event.target.value
        })
    }

    saveCollection() {
        const name = this.state.name.trim()
        if (this.state.name.trim() !== '') {
            this.setState({
                collections: this.props.createCollection(name),
                existCollection: false,
                name: ''
            })
        }
    }

    cancelAction() {
        this.setState({
            adding: false
        })
    }


}

export default props =>
    <VideotecaContext.Consumer>
        {
            ({ getCollections, createCollection }) =>
                <FilmsCollections {...props}
                    getCollections={getCollections}
                    createCollection={createCollection} />
        }
    </VideotecaContext.Consumer>