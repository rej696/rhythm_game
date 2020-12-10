import React from 'react';
import axios from 'axios';

function ScoreBoardEntry(props) {
    return (
        <div className="scoreBoardEntry">
            <div className="usernameScoreBoard">{props.username}</div>
            <div className="scoreScoreBoard">{props.score}</div>
        </div>
    )
}

function ScoreBoard(props)  {
    const oldScores = props.scores;
    let newScores = [];
    for (let i in props.scores) {
        let score = {...oldScores[i], scorder: i};
        newScores.push(score);
    }
    return (
        <div className="scoreBoard">
            <h3>Scores on the Doors!</h3>
            <ScoreBoardEntry key="header" username="Username" score="Score" />
            {newScores.map(score => (
                <ScoreBoardEntry key={score.scorder} username={score.username} score={score.score} />
            ))}
        </div>
    );
}

export default class ScoreHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            highScore: {username: '', score: 0},
            currentUser: '',
            // currentScore: this.props.currentScore,
            scores: [{username: '', score: 0}],
            dataEntered: false,
        };
    }

    getHighScore = () => {
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

    addScore = () => {
        let username = this.state.currentUser;
        let score = this.props.currentScore;
    
        axios.get(
            '/api/v1/add-score', {
                params: {
                    'username': username,
                    'score': score
                }
            }).then((res) => {console.log(res)})
    }

    getScores = () => {
        axios.get('/api/v1/get-scores').then((res) => {
            const response = res.data;
            
            const oldScores = response;
            let newScores = [];
            for (let i in oldScores) {
                let score = {...oldScores[i], scorder: i};
                newScores.push(score);
            }
            this.setState({
                scores: newScores,
            });
            console.log(newScores);
        });
    }

    componentDidMount() {
        this.getScores();
        this.getHighScore();
    }

    componentWillUnmount() {
        this.setState({dataEntered: false, currentUser: '',})
    }

    usernameChangeHandler = (event) => {
        this.setState({currentUser: event.target.value,});
    }

    // scoreChangeHandler = (event) => {
    //     this.setState({currentScore: Number(event.target.value)});
    // }

    submitScore = (event) => {
        event.preventDefault();
        // if (this.state.currentUser === "" || this.props.currentScore === 0) {
        //     alert("Must enter valid username and score");
        if (this.state.currentUser === "") {
            alert("Must enter valid username and score");
        } else {
            this.addScore();
        }
        this.getScores();
        this.getHighScore();
        this.setState({dataEntered: true,})
    }

    render() {
        let displayInput = !this.state.dataEntered && this.props.currentScore !== 0 ? true : false;

        return (
            <div>
                <h2>{this.state.highScore.username}'s High Score: {this.state.highScore.score}</h2>
                
                {displayInput &&
                    <form onSubmit={this.submitScore}>
                        <h3>
                            User: {this.state.currentUser}, 
                            Score: {this.props.currentScore}
                        </h3>
                        <div className="userInput">
                            <label for='username'>Username:</label>
                            <input type='text' id='username' name='username' onChange={this.usernameChangeHandler} />
                            {/* <label for='score'>Score:</label>
                            <input type='text' id='score' name='score' onChange={this.scoreChangeHandler} /> */}
                            <button type='submit'>Add Score!</button>
                        </div>
                    </form>
                }
                <ScoreBoard scores={this.state.scores}/>
            </div>
        )
    }
}