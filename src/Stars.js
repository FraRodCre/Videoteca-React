import React, { Component } from 'react'
import './Stars.css'

export default class Stars extends Component {

    render() {
        return (
            <div className="stars">
                {this.createStars()}
            </div>
        )
    }

    createStars() {
        let stars = []

        if (this.props.stars > -1) {
            
            for (let i = 0; i < this.props.stars; i++) {
                stars.push(<img key={`${this.props.id}-${i}`} src="/star.svg" className="star--on" alt="Star On" />)
            }

            for (let i = this.props.stars; i < 5; i++) {
                stars.push(<img key={`${this.props.id}-${i}`} src="/star.svg" className="star--off" alt="Star On" />)
            }
        }

        return stars
    }
}