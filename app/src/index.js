import React from 'react';
import ReactDOM from 'react-dom';
import { FourTrack } from './backingTrack';
import ScoreHandler from './scoreBoard.js';
//index.css is from tictactoe game
//import './index.css';
import './blockLayout.css'
import Blooper from "./backingTrack.js";
import Schema from './musicSchema.js';

// import MusicBox from './synth.js';


class Block extends React.Component {
    render() {
        return (
        <div className="block" style={{top: this.props.value.yPos + 'px'}}>
            <Blooper note="C" octave="4" waveType="square"/>
        </div>);
    }
}

class Rail extends React.Component {
    renderBlocks() {
        let blockElements = [];
        for (let i in this.props.value.blocks) {
            blockElements.push(this.props.value.blocks[i].getRender());
        }
        return blockElements;
    }

    renderTargetZone() {
        return this.props.value.targetZone.getRender();
    }

    renderDispenser() {
        return this.props.value.dispenser.getRender();
    }

    render() {
        return (
            <div className="rail" style={{left: this.props.value.xPos + 'px'}}>
                {this.renderDispenser()}
                {this.renderBlocks()}
                {this.renderTargetZone()}
                
            </div>
        );
    }
}

class BlockJS {
    constructor(initialYPos, speed){
        this.yPos = initialYPos;
        this.speed = speed;
    }

    update() {
        this.yPos = this.yPos + this.speed;
    }

    getRender() {
        return <Block value={this} />;
    }
}

class TargetZone extends React.Component {
    render() {
        return (
            <div>
                <hr className="targetZone" style={{left: this.props.value.xPos, top: this.props.value.top}} />
                <hr className="targetZone" style={{left: this.props.value.xPos, top: this.props.value.bottom}} />
            </div>
        );
    }

}

class TargetZoneJS {
    constructor(xPos, railHeight) {
        this.xPos = xPos;
        this.railHeight = railHeight;
        this.top = railHeight - 70;
        this.bottom = railHeight - 30;
    }

    getRender() {
        return <TargetZone value={this} />;
    }

}

class Dispenser extends React.Component {
    render() {
        return (
            <div>
                <hr className="dispenser" style={{left: this.props.value.xPos, top: this.props.value.top}} />
                <hr className="dispenser" style={{left: this.props.value.xPos, top: this.props.value.bottom}} />
            </div>
        );
    }

}

class DispenserJS {
    constructor(xPos, railHeight) {
        this.xPos = xPos;
        this.railHeight = railHeight;
        this.top = railHeight - 70;
        this.bottom = railHeight - 30;
    }

    getRender() {
        return <Dispenser value={this} />;
    }

}

class RailJS {
    constructor(key, letter, xPos, height, blockSpeed) {
        this.key = key;
        this.xPos = xPos;
        this.letter = letter;
        this.blocks = [];
        this.blockSpeed = blockSpeed;
        this.height = height;
        this.targetZone = new TargetZoneJS(xPos, height);
        this.dispenser = new DispenserJS(xPos, height);
    }

    update(createBlock) {
        this.updateBlocks(createBlock);
    }

    updateBlocks(createBlock) {
        for (let i in this.blocks) {
            this.blocks[i].update();
            if (this.blocks[i].yPos >= this.height) {
                this.blocks.splice(i, 1)
            }
        }
        if (createBlock) {
            this.blocks.push(new BlockJS(80, this.blockSpeed));
        }
    }

    getRender() {
        return <Rail key={this.key} value={this} />;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.railHeight = 400;
        this.updateRateMS = 10;
        this.blockSpeed = 4;
        this.railLetters = ['w', 's', 'd', 'f', 'j', 'k', 'l', ';'];
        
        this.state = {
            yPos: props.timer,
            timerCount: 0,
            rails: [],
            keyDown: props.keyDown,
            // rails: Array(8).fill(null),
            schema: new Schema(this.updateRateMS, this.railHeight, this.blockSpeed),
        };
        this.setUpRails();
    }

    getLowestBlockOnRail(railNo) {
        // letter to press
        for (let rail in this.state.rails) {
            
        }
        let rail = this.state.rails[railNo];
        let blocksOnRail = this.state.rails[railNo].blocks;
        let lowestBlock = blocksOnRail[0]; // calculate score from block position
        let lowestBlockPos = lowestBlock.yPos;
        
        //let rail
        // remove block from rail
        
    }

    setUpRails() {
        let rails = this.state.rails;
        let railLeft = 60;
        const railSpace = 40;
        // let letters = ['a', 's', 'd', 'f'] 

        for (let i in this.railLetters) {
            let letter = this.railLetters[i];
            rails[i] = new RailJS(i, letter, railLeft, this.railHeight, this.blockSpeed);
            railLeft += railSpace;
        }

        // for (let i in rails) {
        //     rails[i] = new RailJS(i, letters[i], railLeft, this.railHeight, this.blockSpeed);
        //     railLeft += railSpace;
        // }
    }

    tick() {
        this.setState(state => ({
            timerCount: state.timerCount + 1,
        }));

        this.updateSchema();
        this.updateRails();
    }

    updateSchema() {
        this.state.schema.update();
    }

    updateRails() {
        let rails = this.state.rails.slice();
        let blockTrigs = this.state.schema.blockTriggers
        let blocksToCreate = 0;
        for (let i in blockTrigs) {
            if (blockTrigs[i].value) {
                blocksToCreate += 1;
            }
        }

        let railsWithNewBlocks = []
        for (let i = 0; i < blocksToCreate; i ++) {
            let validRailID = null; // Ensure that if two buttons need to be done at the same time, there are two rails for them.
            
            railsWithNewBlocks.push(Math.floor(Math.random() * this.state.rails.length));
        }
        for (let i in rails) {
            let createBlock = false;
            for (let j in railsWithNewBlocks) {
                if (railsWithNewBlocks[j] == i) {
                    createBlock = true;
                    break;
                }
            }
            rails[i].update(createBlock);
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), this.updateRateMS);
        window.addEventListener('keydown', this.props.handleKeyDown);
        window.addEventListener('keyup', this.props.handleKeyUp);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    renderRails() {
        let railElements = [];
        for (let i in this.state.rails) {
            railElements.push(this.state.rails[i].getRender());
        }
        return railElements;
    }

    render() {
        // console.log(this.state.keyDown);
        for (let key in this.state.keyDown) {
            if (this.state.keyDown[key]) {
                console.log('key ' + key + ' pressed');
            }
        }
        return (
            <div className="game">
                {this.renderRails()}
                <FourTrack triggers={this.state.schema.trackTriggers} clock={this.state.timerCount}/>
            </div>
        );
    }
}

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.state = {
            play: false,
            currentScore: 0,
            keyDown: {"a": false, "c": false, "d": false, "f": false}
        };
    }

    // let keyboardToRailMap = {
    //     keycodeA : this.state.rails[0],
    //     keycodeS : this.state.rails[1],
    //     keycodeD : this.state.rails[2],
    //     keyCodeF : this.state.rails[3],
    // }
    
    // keyDown(chord) {
    //     // console.log(chord);
    //     let keyPressed = this.state.keyPressed;
    //     keyPressed[chord] = true
    //     this.setState({keyPressed,})
    //     console.log(this.state);
    // }

    handleKeyDown = (e) => {
        let keycode = e.keyCode

        let setKeyDown = (note) => {
            let keyDown = this.state.keyDown;
            keyDown[note] = true;
            this.setState({keyDown,});
            // console.log("keydown");
            // console.log(this.state.keyDown);
        };

        if (this.state.play === true) { 
            if (keycode === 65) {
                setKeyDown('a');
            }
            if (keycode === 83) {
                setKeyDown('c');
            }
            if (keycode === 68) {
                setKeyDown('d');
            }
            if (keycode === 70) {
                setKeyDown('f');
            }
        }
    }

    handleKeyUp = (e) => {
        let keycode = e.keyCode;
        
        let setKeyUp = (note) => {
            let keyDown = this.state.keyDown;
            keyDown[note] = false;
            this.setState({keyDown,});
            // console.log("keyup");
            // console.log(this.state.keyDown);
        };

        if (this.state.play === true) { 
            if (keycode === 65) {
                setKeyUp('a');
            }
            if (keycode === 83) {
                setKeyUp('c');
            }
            if (keycode === 68) {
                setKeyUp('d');
            }
            if (keycode === 70) {
                setKeyUp('f');
            }
        }                                        
    }    
    

    scoreChangeHandler = (event) => {
        this.setState({currentScore: Number(event.target.value),});
    }

    changeMode = () => {
        let mode = this.state.play;
        if (!mode) {
            this.setState({currentScore: 0,})
        }
        this.setState({play: !this.state.play,});
    }

    render() {
        // console.log(this.state.play);
        return (
            <div className="App">

                {!this.state.play && 
                    <div>
                        <h1>Welcome to Rhythm City!</h1>
                        <button onMouseDown={this.changeMode}>New Game!</button>
                        <ScoreHandler currentScore={this.state.currentScore}/>
                    </div>
                }

                {this.state.play && 
                    <div>
                        {/* <h1>Welcome to Rhythm City!</h1> */}
                        <div className="gameMenu">
                            <h2 className="currentScore">Current Score: {this.state.currentScore}!</h2>
                            <input className="scoreInput" type='text' onChange={this.scoreChangeHandler} />
                        </div>
                        <button onMouseDown={this.changeMode}>Go to Scoreboard!</button>
                        <Game onKeyDown={(e) => this.handleKeyDown()}
                            handleKeyDown={this.handleKeyDown}
                            onKeyUp={(e) => this.handleKeyUp()}
                            handleKeyUp={this.handleKeyUp} 
                            keyDown={this.state.keyDown}/>
                    </div>
                }
            </div>
        );
    }
}

ReactDOM.render(
    // <Game />,
    <Page />,
    // <Timer />,
    // <MusicBox />,
    document.getElementById('root')
);
