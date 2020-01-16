import React, { Component } from 'react';
import './legend.css';
import source from '../../assets/arrow.png';
import destination from '../../assets/target.png';

export default class Legends extends Component {
    render() {
        return (
            <div className="legend-main">
                <div className="each-legend">
                    <div className="legend-icon">
                        <img src={source}></img>
                    </div>
                    <div className="legend-name">
                        Source
                    </div>
                </div>
                <div className="each-legend">
                    <div className="legend-icon">
                        <img src={destination}></img>
                    </div>
                    <div className="legend-name">
                        Destination
                    </div>
                </div>
                <div className="each-legend">
                    <div className="legend-icon wall-legend">

                    </div>
                    <div className="legend-name">
                        Wall
                    </div>
                </div>
                <div className="each-legend">
                    <div className="legend-icon shortest-path-legend">

                    </div>
                    <div className="legend-name">
                        Shortest Path
                    </div>
                </div>
            </div>
        )
    }
};