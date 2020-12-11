import React from 'react';
// import ReactDOM from 'react-dom';

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscList = [];
for (let i=0; i<9; i++) {
    oscList[i] = [];
}

let masterGainNode = null;
masterGainNode = audioContext.createGain();
masterGainNode.connect(audioContext.destination);
masterGainNode.gain.value = 0.5;

let noteMap = {
    "A": 0,
    "Bb": 1,
    "B": 2,
    "C": 3,
    "C#": 4,
    "D": 5,
    "Eb": 6,
    "E": 7,
    "F": 8,
    "F#": 9,
    "G": 10,
    "G#": 11,
};


export default class Blooper extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            pressed: false,
            oscListIndex: this.props.note + this.props.octave,
            freq: this.getFreq(this.props.note, this.props.octave),
            waveType: this.props.waveType,
        }

        this.notePressed = this.notePressed.bind(this);
        this.noteReleased = this.noteReleased.bind(this);
        this.noteClicked = this.noteClicked.bind(this);
    }

    getFreq = (note, octave) => {
        let n = (12*octave + noteMap[note]) - 12*5;
        return 440 * Math.pow(2, n/12)
    }

    playTone = (freq) => {
        let osc = audioContext.createOscillator();
        osc.connect(masterGainNode);
    
        osc.type = this.state.waveType;
    
        osc.frequency.value = freq;
        osc.start();
    
        return osc;
    }

    notePressed = () => {
        if (!this.state.pressed) {
            oscList[this.state.oscListIndex] = this.playTone(this.state.freq);
            this.setState({pressed: true});
        }
    }

    noteReleased = () => {
        if (this.state.pressed) {
            oscList[this.state.oscListIndex].stop();
            oscList[this.state.oscListIndex] = null;
            this.setState({pressed: false});
        }
    }

    noteClicked(event) {
        if (event.buttons & 1) {
            this.notePressed();
        }
    }

    render() {
        return (
            <button className="blooper"
                onMouseDown={this.noteClicked}
                onMouseUp={this.noteReleased}
                onMouseLeave={this.noteReleased}
                >
                <div>
                    {this.props.letter} {/*.charAt(0).toUpperCase()*/}
                    {/* {this.props.note} */}
                    {/* <sub>{this.props.octave}</sub> */}
                </div>
            </button>
        )
    }
}

//=========================================================================================
// Four Track Sequencer
//=========================================================================================

class MusicTrack extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            trig: false,
            noteOffTime: null,
            oscListIndex: null,
        }

    }

    getFreq = (note, octave) => {
        let n = (12*octave + noteMap[note]) - 12*5;
        return 440 * Math.pow(2, n/12)
    }

    playTone = (note, octave, waveType) => {
        let osc = audioContext.createOscillator();
        osc.connect(masterGainNode);
    
        osc.type = waveType;
    
        osc.frequency.value = this.getFreq(note, octave);
        osc.start();
    
        return osc;
    }

    noteOn = (key, note, octave, waveType, gate, clock) => {
        if (!this.state.trig) {
            // console.log("gate @" + gate);
            // console.log("noteofftime pre oscilator" + (gate + clock));
            let oscListIndex = key + note + octave;
            oscList[oscListIndex] = this.playTone(note, octave, waveType);
            this.setState({
                trig: true,
                noteOffTime: Number(gate + clock),
                oscListIndex: oscListIndex,
            });
            // console.log("noteOffTime " + this.state.noteOffTime)
        }
    }

    noteOff = (clock) => {
        if (this.state.trig 
            && (clock >= this.state.noteOffTime)) {
            // console.log("note off @" + clock);
            oscList[this.state.oscListIndex].stop();
            oscList[this.state.oscListIndex] = null;
            this.setState({
                trig: false,
                noteOffTime: 0,
                oscListIndex: null,
            });
        }
    }

    componentWillUnmount() {
        if (this.state.oscListIndex) {
            oscList[this.state.oscListIndex].stop();
            oscList[this.state.oscListIndex] = null;
            this.setState({
                trig: false,
                noteOffTime: 0,
                oscListIndex: null,
            });
        }
    }

    render() {
        if (this.props.trig) {
            this.noteOn(
                this.props.key,
                this.props.note,
                this.props.octave,
                this.props.waveType,
                Number(this.props.gate),
                Number(this.props.clock),
            );
        } else {
            this.noteOff(Number(this.props.clock));
        };
        return (<div hidden>I am an easter egglet</div>);
    }
}

export class FourTrack extends React.Component {
    render() {

        return (
            <div>
                <MusicTrack 
                    key="track1"
                    clock={this.props.triggers[0].clock}
                    trig={this.props.triggers[0].value}
                    gate="20"
                    note="C"
                    octave="4"
                    waveType="sine" />

                <MusicTrack 
                    key="track2"
                    clock={this.props.triggers[1].clock}
                    trig={this.props.triggers[1].value}
                    gate="30"
                    note="F"
                    octave="4"
                    waveType="sine" />
                <MusicTrack 
                    key="track3"
                    clock={this.props.triggers[2].clock}
                    trig={this.props.triggers[2].value}
                    gate="100"
                    note="G"
                    octave="4"
                    waveType="sine" />
                
                <MusicTrack 
                    key="track4"
                    clock={this.props.triggers[3].clock}
                    trig={this.props.triggers[3].value}
                    gate="20"
                    note="D"
                    octave="3"
                    waveType="sine" />

                {/* <MusicTrack key="track2" on={on} noteTime="500" note="E" octave="4" waveType="sine" />
                <MusicTrack key="track3" on={on} noteTime="500" note="G" octave="5" waveType="sine" /> */}
                {/* <MusicTrack key="track4" on="true" note="Bb" octave="4" waveType="sine" /> */}
            </div>
        )
    }
}