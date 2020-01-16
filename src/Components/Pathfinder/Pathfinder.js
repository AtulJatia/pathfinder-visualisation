import React, { Component } from 'react';
import './pathfinder.css';
import Node from './Node';
import { dijkrstas, shortestPath } from '../../algorithms/Dijkstras';
import Legends from './Legends';
import pathFinderIcon from '../../assets/place.png';
import wall1Points from './wall1Points';
import points from './wall1Points';

class Pathfinder extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            startNodeChosen: false,
            endNodeChosen: false,
            COLS: 50,
            ROWS: 30,
            START_NODE_ROW: 10,
            START_NODE_COL: 15,
            END_NODE_ROW: 10,
            END_NODE_COL: 35,
            visualising: false,
            max_row_val: 10,
            max_col_val: 10,
            old_row: -1,
            old_col: -1
        };
    }

    componentDidMount() {
        this.calculateNumberOfRowsAndColumns();
    }

    drawRandomWalls = () => {
        this.setState({
            visualising: true
        })
        let ctr = 0;
        for (let i = 0; i < points.length; i++) {
            const element = points[i];
            ctr += 1;
            setTimeout(() => {
                if (i == points.length - 1) {
                    this.setState({
                        visualising: false
                    })
                }
                if (element[0] < this.state.ROWS && element[1] < this.state.COLS) {

                    this.getGridWithWallToggled(element[0], element[1]);
                }

            }, ctr * 10);
        }
    }

    createInitialGrid = () => {

        const START_NODE_ROW = Math.round(this.state.ROWS / 2) - 2;
        const START_NODE_COL = Math.round(this.state.COLS / 5);
        const END_NODE_ROW = Math.round(this.state.ROWS / 2) - 2;
        const END_NODE_COL = Math.round(this.state.COLS / 1.5);

        this.setState({
            START_NODE_ROW,
            START_NODE_COL,
            END_NODE_ROW,
            END_NODE_COL
        }, () => {
            let grid = [];
            for (let i = 0; i < this.state.ROWS; i++) {
                let eachRow = [];
                for (let j = 0; j < this.state.COLS; j++) {
                    eachRow.push(this.createNode(i, j));
                }
                grid.push(eachRow);
            }
            this.setState({ grid });
        })
    }

    createNode = (row, col) => {
        return {
            row: row,
            col: col,
            isFinish: this.state.END_NODE_ROW === row && this.state.END_NODE_COL === col,
            isStart: this.state.START_NODE_ROW === row && this.state.START_NODE_COL === col,
            isWall: false,
            distance: Infinity,
            isVisited: false,
            previousNode: null
        }
    }

    calculateNumberOfRowsAndColumns = () => {
        if (this.state.visualising) return;
        const COLS = Math.round(window.innerWidth / 28) - 2;
        const ROWS = Math.round(window.innerHeight / 28) - 6;
        this.setState({
            COLS,
            ROWS
        }, () => {
            this.createInitialGrid();
        });
    }

    getGridWithWallToggled = (row, col) => {
        const checkNode = this.state.grid[row][col];
        if ((checkNode.isWall && this.state.startNodeChosen) || (checkNode.isWall && this.state.endNodeChosen)) {
            return;
        }
        if (this.state.startNodeChosen && row === this.state.END_NODE_ROW && col === this.state.END_NODE_COL) {
            return;
        }
        if (this.state.endNodeChosen && row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL) {
            return;
        }
        if (this.state.startNodeChosen) {
            const newGrid = this.state.grid.slice();
            const oldNode = newGrid[row][col];
            const newNode = {
                ...oldNode,
                isStart: true
            };
            newGrid[row][col] = newNode;
            this.setState({
                grid: newGrid,
                startNodeChosen: false,
                START_NODE_ROW: row,
                START_NODE_COL: col
            })
            return;
        }

        if (this.state.endNodeChosen) {
            const newGrid = this.state.grid.slice();
            const oldNode = newGrid[row][col];
            const newNode = {
                ...oldNode,
                isFinish: true
            };
            newGrid[row][col] = newNode;
            this.setState({
                grid: newGrid,
                endNodeChosen: false,
                END_NODE_ROW: row,
                END_NODE_COL: col
            })
            return;
        }

        if (row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL && this.state.mouseIsPressed) {
            this.setState({
                mouseIsPressed: false
            });
            return;
        }
        if (row === this.state.END_NODE_ROW && col === this.state.END_NODE_COL && this.state.mouseIsPressed) {
            this.setState({
                mouseIsPressed: false
            });
            return;
        }
        if (row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL && !this.state.mouseIsPressed) {
            const newGrid = this.state.grid.slice();
            const oldNode = newGrid[row][col];
            const newNode = {
                ...oldNode,
                isStart: false
            };
            newGrid[row][col] = newNode;
            this.setState({
                grid: newGrid,
                startNodeChosen: true,
                START_NODE_ROW: -1,
                START_NODE_COL: -1
            })
            return;
        }
        if (row === this.state.END_NODE_ROW && col === this.state.END_NODE_COL && !this.state.mouseIsPressed) {
            const newGrid = this.state.grid.slice();
            const oldNode = newGrid[row][col];
            const newNode = {
                ...oldNode,
                isFinish: false
            };
            newGrid[row][col] = newNode;
            this.setState({
                grid: newGrid,
                endNodeChosen: true,
                END_NODE_ROW: -1,
                END_NODE_COL: -1
            })
            return;
        }
        const newGrid = this.state.grid.slice();
        const oldNode = newGrid[row][col];
        const newNode = {
            ...oldNode,
            isWall: !oldNode.isWall
        };
        newGrid[row][col] = newNode;
        this.setState({
            grid: newGrid
        })
    }

    resetTheGrid = () => {
        let grid = [];
        const START_NODE_ROW = Math.round(this.state.ROWS / 2) - 2;
        const START_NODE_COL = Math.round(this.state.COLS / 5);
        const END_NODE_ROW = Math.round(this.state.ROWS / 2) - 2;
        const END_NODE_COL = Math.round(this.state.COLS / 1.5);
        this.setState({
            START_NODE_ROW,
            START_NODE_COL,
            END_NODE_ROW,
            END_NODE_COL
        }, () => {
            for (let i = 0; i < this.state.ROWS; i++) {
                let eachRow = [];
                for (let j = 0; j < this.state.COLS; j++) {
                    eachRow.push(this.createNode(i, j));
                    if (i === this.state.START_NODE_ROW && j === this.state.START_NODE_COL) {
                        document.getElementById(`node-${i}-${j}`).className = 'node node-start';
                    }
                    else if (i === this.state.END_NODE_ROW && j === this.state.END_NODE_COL) {
                        document.getElementById(`node-${i}-${j}`).className = 'node node-finish';
                    }
                    else {
                        document.getElementById(`node-${i}-${j}`).className = 'node';
                    }
                }
                grid.push(eachRow);
            }

            this.setState({ grid });
        })

    }


    handleMouseDown(row, col) {
        console.log(`Mouse Down`);
        this.getGridWithWallToggled(row, col);
        this.setState({
            mouseIsPressed: true
        });
    }

    handleMouseUp() {
        console.log(`Mouse up`);
        this.setState({
            mouseIsPressed: false
        });
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        console.log(`Mouse enter`);
        if (row === this.state.old_row && col == this.state.old_col) {
            return;
        }
        this.setState({
            old_row: row,
            old_col: col
        }, () => {
            this.getGridWithWallToggled(row, col);
        })
    }

    animateDijkstras(result, shortestPath) {
        for (let i = 0; i < result.length; i++) {
            const { row, col } = result[i];
            setTimeout(() => {
                if (i == result.length - 1) {
                    this.animateShortedPath(shortestPath);
                    this.setState({
                        visualising: false
                    })
                }
                else {
                    document.getElementById(`node-${row}-${col}`).className = `node node-visited`;
                }
            }, i * 10);

        }
    }

    animateShortedPath(shortestPath) {
        for (let i = 0; i < shortestPath.length; i++) {
            const { row, col } = shortestPath[i];
            setTimeout(() => {
                document.getElementById(`node-${row}-${col}`).className = `node node-shortest-path`;
            }, i * 25);
        }
    }

    dijkstras() {
        this.setState({
            visualising: true
        }, () => {
            const { grid, START_NODE_ROW, START_NODE_COL, END_NODE_ROW, END_NODE_COL } = this.state;
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const endNode = grid[END_NODE_ROW][END_NODE_COL];
            const result = dijkrstas(grid, startNode, endNode);
            const actualShortestPath = shortestPath(endNode);
            this.animateDijkstras(result, actualShortestPath);
        })
    }

    render() {
        return <div
            onMouseUp={() => this.handleMouseUp()}
        >
            <div className="main-header">
                {/* <div className="main-header__heading"> */}
                <img
                    className="path-finder-icon"
                    src={pathFinderIcon}
                ></img>
                <h1>Pathfinding Algorithm Visualisation</h1>
                <div className="main-header__draw-walls">
                    {
                        this.state.visualising ? (
                            <button
                                disabled
                                style={{
                                    cursor: 'not-allowed'
                                }}
                                onClick={() => {
                                    this.drawRandomWalls()
                                    this.setState({
                                        mouseIsPressed: false
                                    })
                                }}
                            >
                                Draw walls
                    </button>
                        ) : (
                                <button
                                    onClick={() => {
                                        this.drawRandomWalls()
                                        this.setState({
                                            mouseIsPressed: false
                                        })
                                    }}
                                >
                                    Draw walls
                    </button>
                            )
                    }

                </div>

                <div className="main-header__name">
                    {
                        this.state.visualising ? (
                            <button
                                disabled
                                style={{
                                    cursor: 'not-allowed'
                                }}
                                onClick={() => this.dijkstras()}
                            >
                                Visualise Dijkstra's Algorithm
                            </button>
                        ) : (
                                <button
                                    onClick={() => this.dijkstras()}
                                >
                                    Visualise Dijkstra's Algorithm
                        </button>
                            )
                    }
                </div>
                <div
                    className="main-header__clear"
                >
                    {
                        this.state.visualising ? (
                            <button
                                disabled
                                style={{ cursor: 'not-allowed' }}
                                onClick={() => this.resetTheGrid()}
                            >
                                Clear the grid
            </button>
                        ) : (
                                <button
                                    onClick={() => this.resetTheGrid()}
                                >
                                    Clear the grid
                </button>
                            )
                    }

                </div>
            </div>
            <Legends />
            <table
                id="table"
            >
                <tbody>
                    {this.state.grid.map((row, rowIndex) => {
                        return (<tr key={rowIndex}>
                            {row.map((node, columnIndex) => {
                                const { row, col, isFinish, isStart, isWall } = node;
                                return (
                                    <Node key={(columnIndex + 1) + (rowIndex + 1) * 100}
                                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                        onMouseUp={(row, col) => this.handleMouseUp()}
                                        onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                        row={row}
                                        col={col}
                                        isStart={isStart}
                                        isFinish={isFinish}
                                        isWall={isWall}
                                    />
                                );
                            }
                            )}
                        </tr>
                        );
                    })}
                </tbody>
            </table>

        </div >
    }
}

export default Pathfinder;