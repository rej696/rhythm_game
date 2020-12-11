import React from 'react';
import ReactDOM from 'react-dom';
import { FourTrack } from './backingTrack';
import ScoreHandler from './scoreBoard.js';
import './blockLayout.css'
import Blooper from "./backingTrack.js";
import Schema from './musicSchema.js';

// import MusicBox from './synth.js';


class Block extends React.Component {
    render() {
        return (
        <div className="block" style={{top: this.props.value.yPos + 'px', left: this.props.value.left + 'px'}}>
            <Blooper note="C" octave="4" waveType="square" letter={this.props.value.letter} color={this.props.value.color} />
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
            <div className="rail" style={{left: this.props.value.xPos + 'px', width: this.props.value.width + 'px'}}>
                {this.renderDispenser()}
                {this.renderBlocks()}
                {this.renderTargetZone()}
            </div>
        );
    }
}

class BlockJS {
    constructor(initialYPos, speed, railWidth, letter){
        this.yPos = initialYPos;
        this.speed = speed;
        this.left = railWidth / 2 - 10;
        this.letter = letter;
        this.color = '#13fc03';
        this.removeSoon = false;
        this.removeCount = 15;
        this.remove = false;
    }

    update() {
        this.yPos = this.yPos + this.speed;
        if (this.removeSoon) {
            this.removeCount -= 1;
            if (this.removeCount === 0) {
                this.remove = true;
            }
        }
    }

    getRender() {
        return <Block value={this} />;
    }
}

class TargetZone extends React.Component {
    render() {
        return (
            <div>
                <hr className="targetZone" style={{top: this.props.value.top}} />
                <hr className="targetZone" style={{top: this.props.value.bottom}} />
            </div>
        );
    }

}

class TargetZoneJS {
    constructor(railHeight) {
        this.railHeight = railHeight;
        this.top = railHeight - 100;
        this.bottom = railHeight - 30;
        this.thickness = 4;
    }

    getRender() {
        return <TargetZone value={this} />;
    }

}

class Dispenser extends React.Component {
    render() {
        return (
            <div>
                <hr className="dispenser" style={{top: this.props.value.top + 'px',
                    width: this.props.value.width + 'px',
                    left: this.props.value.left + 'px',
                    height: this.props.value.height + 'px'}} />
                <hr className="dispenser" style={{top: this.props.value.bottom + 'px',
                    width: this.props.value.width + 'px',
                    left: this.props.value.left + 'px',
                    height: this.props.value.height + 'px'}} />
            </div>
        );
    }

}

class DispenserJS {
    constructor(railWidth) {
        this.railWidth = railWidth;
        this.top = 14;
        this.bottom = 0;
        this.width = 20;
        this.left = this.calculateLeft;
        this.height = 6;
    }

    calculateLeft() {
        return (this.railWidth / 2) - (this.width / 2);
    }

    update(blockCount) {
        if (blockCount === 0) {
            this.top = 14;
            this.width = 20;
            this.height = 6;
        }
        else {
            this.top = 14 * blockCount;
            this.bottom = this.top - 20;
            this.height = 10;
            this.width = 30;
        }
        this.left = this.calculateLeft();
    }

    getRender() {
        return <Dispenser value={this} />;
    }

}

class RailJS {
    constructor(key, letter, xPos, height, blockSpeed, handleScore) {
        this.key = key;
        this.xPos = xPos;
        this.letter = letter;
        this.width = 80;
        this.blocks = [];
        this.blockSpeed = blockSpeed;
        this.height = height;
        this.handleScore = handleScore;
        this.targetZone = new TargetZoneJS(height);
        this.dispenser = new DispenserJS(this.width);
    }

    update(createBlock) {
        this.updateBlocks(createBlock);
        this.dispenser.update(this.blocks.length);
    }

    updateBlocks(createBlock) {
        for (let i in this.blocks) {
            this.blocks[i].update();
            if (this.blocks[i].remove) {
                this.removeLowestBlock();
            }
            else if (this.blocks[i].yPos >= this.height) {
                this.handleScore(- 1);
                this.blocks.splice(i, 1);
            }
        }
        if (createBlock) {
            this.blocks.push(new BlockJS(80, this.blockSpeed, this.width, this.letter));
        }
    }

    changeBlockColor(lowestBlock) {
        if (this.blocks.length > 0) {
            if (this.blockWithinZone(lowestBlock)) {
                lowestBlock.color = 'blue';
                lowestBlock.removeSoon = true;
            }
            else {
                lowestBlock.color = 'red';
                lowestBlock.removeSoon = true;
            }
        }
    }

    removeLowestBlock() {
        this.blocks.splice(0, 1);
    }

    handleKeyPress() {
        let lowestBlock = this.blocks[0];

        this.handleScore(this.calculateScore(lowestBlock));

        this.changeBlockColor(lowestBlock);

        // this.removeLowestBlock();
    }

    calculateScore(block) {
        if (block == null) {
            return - 2;
        }
        return this.blockWithinZone(block) ? 1 : - 2;
    }

    blockWithinZone(block) {
        if (block == null) {
            return false;
        }
        return block.yPos > this.targetZone.top && block.yPos < this.targetZone.bottom;
    }

    getRender() {
        return <Rail key={this.key} value={this} />;
    }
}

class KeyStuff extends React.Component {
    componentDidMount() {
        window.addEventListener('keydown', this.props.handleKeyDown);
        window.addEventListener('keyup', this.props.handleKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.props.handleKeyDown);
        window.removeEventListener('keyup', this.props.handleKeyUp);
    }

    render() {
        return (<div></div>);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.railHeight = 400;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.updateRateMS = 10;
        this.blockSpeed = 2;
        // this.railLetters = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
        this.railLetters = ['a', 's', 'd', 'f'];
        this.gameOverBlockCount = 60;
        this.blockCount = 0;
        this.gameOver = false;

        this.sweetspotHeight = this.railHeight - 70;
        
        this.state = {
            yPos: props.timer,
            timerCount: 0,
            rails: [],
            // keyDown: props.keyDown,
            // rails: Array(8).fill(null),
            schema: new Schema(this.updateRateMS, this.sweetspotHeight, this.blockSpeed),
            keyDown: {"a": false, "s": false, "d": false, "f": false, "j": false, "k": false, "l": false, ";": false},
        };
        this.setUpRails();
    }
    
    getRailForKey(letter) {
        for (let i in this.state.rails) {
            let rail = this.state.rails[i];
            if (rail.letter === letter) {
                return rail;
            }
        }
    }

    setUpRails() {
        let rails = this.state.rails;
        let railLeft = 60;
        const railSpace = 80;
        let railToKeyMap = {};
        for (let i in this.railLetters) {
            let letter = this.railLetters[i];
            rails[i] = new RailJS(i, letter, railLeft, this.railHeight, this.blockSpeed, this.props.handleScore);
            railLeft += railSpace;
        }
        console.log()
    }

    tick() {
        this.setState(state => ({
            timerCount: state.timerCount + 1,
        }));
        if (this.blockCount >= this.gameOverBlockCount) {
            this.gameOver = true;
        }
        if (!this.gameOver) {
            this.updateSchema();
            this.updateRails();
        }
    }

    updateSchema() {
        this.state.schema.update();
    }

    updateRails() {
        let rails = this.state.rails.slice();
        let blockTrigs = this.state.schema.blockTriggers
        let blocksToCreate = 0;
        let notesToCreate = [];
        for (let i in blockTrigs) {
            if (blockTrigs[i].value) {
                blocksToCreate += 1;
                this.blockCount += 1;
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

    keyCodeToLetter(keycode) {
        if (keycode === 65) {
            return('a');
        }
        if (keycode === 83) {
            return('s');
        }
        if (keycode === 68) {
            return('d');
        }
        if (keycode === 70) {
            return('f');
        }
        if (keycode === 74) {
            return('j');
        }
        if (keycode === 75) {
            return('k');
        }
        if (keycode === 76) {
            return('l');
        }
        if (keycode === 186) {
            return(';');
        }
    }

    handleKeyDown = (e) => {
        let keycode = e.keyCode

        let setKeyDown = (note) => {
            if (!this.state.keyDown[note]) {
                let keyDown = this.state.keyDown;
                keyDown[note] = true;
                this.setState({keyDown,});
                console.log("keydown");
                console.log(this.state.keyDown);
                // this.props.handleScore(1);

                let rail = this.getRailForKey(note);
                if (rail != null) {
                    rail.handleKeyPress();
                }
            }
        };
        setKeyDown(this.keyCodeToLetter(keycode));  
    }

    handleKeyUp = (e) => {
        let keycode = e.keyCode;
        
        let setKeyUp = (note) => {
            let keyDown = this.state.keyDown;
            keyDown[note] = false;
            this.setState({keyDown,});
            console.log("keyup");
            console.log(this.state.keyDown);
        };
        setKeyUp(this.keyCodeToLetter(keycode));                             
    }    

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), this.updateRateMS);
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
        if (this.gameOver) {
            return (<div><br />GAME OVER <br />Go to scoreboard to submit score!</div>);
        }

        return (
            <div className="game">
                {this.renderRails()}
                <FourTrack triggers={this.state.schema.trackTriggers} clock={this.state.timerCount}/>
                <KeyStuff onKeyDown={(e) => this.handleKeyDown()}
                            handleKeyDown={this.handleKeyDown}
                            onKeyUp={(e) => this.handleKeyUp()}
                            handleKeyUp={this.handleKeyUp} 
                            keyDown={this.state.keyDown} />
            </div>
        );
    }
}

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false,
            currentScore: 0,
        };
    }
    
    scoreChangeHandler = (event) => {
        this.setState({currentScore: Number(event.target.value)});
    }

    handleScore = (score) => {
        let currentScore = this.state.currentScore;
        currentScore += Number(score);
        this.setState({currentScore: currentScore});
    }

    changeMode = () => {
        let mode = this.state.play;
        if (!mode) {
            this.setState({currentScore: 0,})
        }
        this.setState({play: !this.state.play,});
    }

    render() {
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
                            {/* <input className="scoreInput" type='text' onChange={this.scoreChangeHandler} /> */}
                        </div>
                        <button onMouseDown={this.changeMode}>Go to Scoreboard!</button>
                        <Game handleScore={this.handleScore}/>
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
