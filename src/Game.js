import React from 'react';
import './Game.css';

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

// Define the Cell component
const Cell = ({ x, y }) => (
    <div
        className="Cell"
        style={{
            left: `${x * CELL_SIZE}px`,
            top: `${y * CELL_SIZE}px`,
            width: CELL_SIZE,
            height: CELL_SIZE,
        }}
    />
);

class Game extends React.Component {
    constructor() {
        super();
        this.rows = HEIGHT / CELL_SIZE;
        this.cols = WIDTH / CELL_SIZE;
        this.board = this.makeEmptyBoard();
        this.boardRef = React.createRef();
    }

    state = {
        cells: [],
        interval: 100,
        isRunning: false,
    }

    runGame = () => {
        this.setState({ isRunning: true });
    }

    stopGame = () => {
        this.setState({ isRunning: false });
    }

    handleIntervalChange = (event) => {
        this.setState({ interval: event.target.value });
    }

    // Create an empty board
    makeEmptyBoard() {
        let board = [];
        for (let y = 0; y < this.rows; y++) {
            board[y] = [];
            for (let x = 0; x < this.cols; x++) {
                board[y][x] = false;
            }
        }
        return board;
    }

    // Create cells from this.board
    makeCells() {
        let cells = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    cells.push({ x, y });
                }
            }
        }
        return cells;
    }

    getElementOffset() {
        const rect = this.boardRef.current.getBoundingClientRect();
        const doc = document.documentElement;
        return {
            x: (rect.left + window.scrollX) - doc.clientLeft,
            y: (rect.top + window.scrollY) - doc.clientTop,
        };
    }

    handleClick = (event) => {
        const elemOffset = this.getElementOffset();
        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientY - elemOffset.y;
        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);

        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            this.board[y][x] = !this.board[y][x];
        }
        this.setState({ cells: this.makeCells() });
    }

    render() {
        const { cells, isRunning, interval } = this.state;
        return (
            <div>
                <div className="controls">
                    Update every
                    <input
                        value={interval}
                        onChange={this.handleIntervalChange}
                    /> 
                    msec
                    {isRunning ? (
                        <button className="button" onClick={this.stopGame}>Stop</button>
                    ) : (
                        <button className="button" onClick={this.runGame}>Run</button>
                    )}
                </div>
                
                <div
                    className="Board"
                    style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px` }}
                    onClick={this.handleClick}
                    ref={this.boardRef}
                >
                    {cells.map(cell => (
                        <Cell
                            x={cell.x}
                            y={cell.y}
                            key={`${cell.x},${cell.y}`}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default Game;
