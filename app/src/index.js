import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { FourTrack } from './backingTrack';
//index.css is from tictactoe game
//import './index.css';
import './blockLayout.css'
import Blooper from "./backingTrack.js";
import Schema from './musicSchema.js';

// import MusicBox from './synth.js';


class Block extends React.Component {
    render() {
        return (
        <div className="block" style={{top: this.props.value.yPos + 'px'}} /*onClick={() => {this.update()}}*/>
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

    render() {
        return (<div className="rail" style={{left: this.props.value.xPos + 'px'}}> {this.renderBlocks()}</div>);
    }
}

class BlockJS {
    constructor(initialYPos, speed){
        this.yPos = initialYPos;
        this.speed = speed;
        // this.speed = Math.random() * speed + 1;
    }

    update() {
        this.yPos = this.yPos + this.speed;
    }

    getRender() {
        return <Block value={this} />;
    }
}

class RailJS {
    // constructor(key, xPos, timerCount) {
    //     this.key = key;
    //     this.xPos = xPos;
    //     this.timerCount = timerCount;
    //     this.blocks = Array(4).fill(null);
    //     this.blockSpeed = 4;
    //     this.setUpBlocks();
    //     this.height = 500;
    // }

    constructor(key, xPos, height, blockSpeed) {
        this.key = key;
        this.xPos = xPos;
        // this.timerCount = game.state.timerCount;
        this.blocks = Array(4).fill(null);
        this.blockSpeed = blockSpeed;
        this.height = height;
        this.setUpBlocks();
    }

    setUpBlocks() {
        let initialYPos = 0;
        for (let i in this.blocks) {
            this.blocks[i] = new BlockJS(initialYPos, this.blockSpeed);
            initialYPos += 10;
        }
    }

    update() {
        this.updateBlocks();
    }

    updateBlocks() {
        for (let i in this.blocks) {
            this.blocks[i].update();
            if (this.blocks[i].yPos >= this.height) {
                this.blocks.splice(i, 1)
            }
        }
        const randomOfTen = Math.floor(Math.random() * 200);
        if (randomOfTen === 0) {
            this.blocks.push(new BlockJS(0, this.blockSpeed));
        }
    }

    getRender() {
        return <Rail key={this.key} value={this} />;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.railHeight = 500;
        this.updateRateMS = 10;
        this.blockSpeed = 4;
        this.state = {
            yPos: props.timer,
            timerCount: 0,
            rails: Array(15).fill(null),
            schema: new Schema(this.updateRateMS, this.railHeight, this.blockSpeed),
        };
        this.setUpRails();
    }

    // const keycodeA = 65
    // const keycodeS = 83
    // const keycodeD = 68
    // const keycodeF= 70

    // let keyboardToRailMap = {
    //     keycodeA : this.state.rails[0],
    //     keycodeS : this.state.rails[1],
    //     keycodeD : this.state.rails[2],
    //     keyCodeF : this.state.rails[3],
    // }
    // playNote(chord) {
    //     console.log(chord)
    // }
    // // //MVP: play certain note when press certain key
    //
    //handle
    // //if (gameInProgress === true) {
    //     handleKeyPress()
    // }
    
    // handleKeyPress(keycode) {
    //     if (keycode === 65) {
    //         this.playNote('a')
    //     }
    //     if (keycode === 83) {
    //         this.playNote('c')
    //     }
    //     if (keycode === 68) {
    //         this.playNote('d')
    //     }
    //     if (keycode === 70) {
    //         this.playNote('f')
    //     }
    // }


    setUpRails() {
        let rails = this.state.rails;
        let railLeft = 60;
        const railSpace = 40;

        for (let i in rails) {
            // rails[i] = new RailJS(i, railLeft, this.state.timerCount);
            rails[i] = new RailJS(i, railLeft, this.railHeight, this.blockSpeed);
            railLeft += railSpace;
        }
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
        for (let i in rails) {
            rails[i].update();
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), this.updateRateMS);
        /*window.addEventListener('keydown', (e) => {
           console.log('key lsitener applied') 
         })*/
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
        this.state = {
            highScore: {username: '', score: 0},
            currentUser: '',
            currentScore: 0,
            scores: [{username: '', score: 0}],
        };
    }

    getHighScore() {
        axios.get('/api/v1/get-highscore').then((res) =>{
            const response = res.data;
            this.setState({
                highScore: {
                    username: response.username,
                    score: response.score
                },
            })
            console.log({highScore:this.state.highScore});
        });
    }

    addScore() {
        let username = this.state.currentUser;
        let score = this.state.currentScore;
        // let username = 'clientboi' + Math.floor(Math.random() * 100);
        // let score = Math.floor(Math.random() * 100);
    
        axios.get(
            '/api/v1/add-score', {
                params: {
                    'username': username,
                    'score': score
                }
            }).then((res) => {console.log(res)})
    }

    getScores() {
        axios.get('/api/v1/get-scores').then((res) => {
            console.log(res);
            const response = res.data;
            this.setState({
                response: response,
            });
        });
    }

    componentDidMount() {
        // this.interval = setInterval(() => this.getHighScore(), 10000);
        this.getScores();
        this.getHighScore();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    usernameChangeHandler = (event) => {
        this.setState({currentUser: event.target.value});
    }

    scoreChangeHandler = (event) => {
        this.setState({currentScore: Number(event.target.value)});
    }

    submitScore = (event) => {
        event.preventDefault();
        if (this.state.currentUser === "" || this.state.currentScore === 0) {
            alert("Must enter valid username and score");
        } else {
            this.addScore();
        }
        this.getScores();
        this.getHighScore();
    }

    render() {

        return (
            <div className="App">
                <h1>Hello from the frontend!</h1>
                <h2>{this.state.highScore.username}'s High Score: {this.state.highScore.score}</h2>
                <form onSubmit={this.submitScore}>
                    <h2>
                        User: {this.state.currentUser}, 
                        Score: {this.state.currentScore}
                    </h2>
                    <div className="userInput">
                        <label for='username'>Username:</label>
                        <input type='text' id='username' name='username' onChange={this.usernameChangeHandler} />
                        <label for='score'>Score:</label>
                        <input type='text' id='score' name='score' onChange={this.scoreChangeHandler} />
                        <button type='submit'>Add Score!</button>
                    </div>
                </form>
                <Game />
            </div>
        )
    }
}

ReactDOM.render(
    // <Game />,
    <Page />,
    // <Timer />,
    // <MusicBox />,
    document.getElementById('root')
);
