import React from 'react';
import ReactDOM from 'react-dom';
import { FourTrack } from './backingTrack';
//index.css is from tictactoe game
//import './index.css';
import './blockLayout.css'
import Blooper from "./backingTrack.js";

// import MusicBox from './synth.js';


class Block extends React.Component {
    render() {
        return (
        <div className="block" style={{top: this.props.value.yPos + 'px'}} /*onKeyPress=""*/ /*onClick={() => {this.update()}}*/>
            <Blooper note="C" octave="4" waveType="square"/>
        </div>);
    }
}

class Rail extends React.Component {
    renderBlocks() {
        let blockElements = [];
        for (let i in this.props.value.blocks) {
            // blockElements.push(<Block value={this.state.blocks[i]} /*id={this.props.id}*//>);
            blockElements.push(<Block value={this.props.value.blocks[i]} />);
        }
        return <div class="rail" style={{left: this.props.value.xPos + 'px'}}> {blockElements} </div>;
    }

    render() {
        return (
            <div className="rail">
                {this.renderBlocks()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yPos: props.timer,
            timerCount: 0,
            rails: Array(15).fill(null),
        };
        this.setUpRails();
    }

    setUpRails() {
        let rails = this.state.rails;
        let railLeft = 60;
        const railSpace = 40;

        for (let i in rails) {
            rails[i] = {
                xPos: railLeft,
                timer: this.state.timerCount,
                blocks: Array(4).fill(null),
            };
            this.setUpBlocks(rails[i].blocks);
            railLeft += railSpace;
        }
    }

    setUpBlocks(blocks) {
        let initialYPos = 0;
        for (let i in blocks) {
            blocks[i] = this.createBlock(initialYPos);
            initialYPos += 10;
        }
    }

    createBlock(initialYPos) {
        return {yPos: initialYPos, speed: Math.random() * 2 + 1,};
    }

    tick() {
        this.setState(state => ({
            timerCount: state.timerCount + 1,
        }));

        this.updateRails();
    }

    updateRails() {
        let rails = this.state.rails.slice();
        for (let i in rails) {
            rails[i].timerCount = this.state.timerCount;
            rails[i].blocks = this.updateBlocks(rails[i].blocks);
        }
        this.setState(state => ({
            rails: rails,
        }));
    }

    updateBlocks(blocks) {
        for (let i in blocks) {
            blocks[i].yPos = blocks[i].yPos + blocks[i].speed;

            if (blocks[i].yPos >= 500) {
                blocks.splice(i, 1)
            }

        }
        const randomOfTen = Math.floor(Math.random() * 200);
        if (randomOfTen === 0) {
            console.log('created new block');
            blocks.push(this.createBlock(0));
        }
        return blocks;
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 10);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    renderRails() {
        let railElements = [];
        for (let i in this.state.rails) {
            railElements.push(<Rail key={i} value={this.state.rails[i]} />);
        }
        return railElements;
    }

    render() {
        return (
            <div className="game">
                {this.renderRails()}
                <FourTrack clock={this.state.timerCount}/>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    // <Timer />,
    // <MusicBox />,
    document.getElementById('root')
);