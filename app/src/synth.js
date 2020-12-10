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

let noteMap = [
    "A",
    "Bb",
    "B",
    "C",
    "C#",
    "D",
    "Eb",
    "E",
    "F",
    "F#",
    "G",
    "G#",
];

let charCodeToNote = {
    "A": ["a", 97],
    "Bb": ["w", 119],
    "B": ["s", 115],
    "C": ["d", 100],
    "C#": ["r", 114],
    "D": ["f", 102],
    "Eb": ["t", 116],
    "E": ["g", 103],
    "F": ["h", 104],
    "F#": ["u", 117],
    "G": ["j", 103],
    "G#": ["i", 105],
    // "a": ["k", 107],
    // "bb": ["o", 111],
    // "b": ["l", 108],
    // "c": [";", 59],
}

// class Synth extends React.Component {
//         constructor(props) {
//             super(props);
            
//             this.state = {
//                 audioContext: new (window.AudioContext || window.webkitAudioContext)(),
//                 oscList: [],
//                 masterGainNode: null,
//             }
//         }
    
//         // render() {}
//     }

// class WaveformSelector extends React.Component {
//     render () {
//         return (
//             <div className="right">
//                 <span>Current Waveform: </span>
//                 <select name="waveform">
//                     <option value="sine">Sine</option>
//                     <option value="square" selected>Square</option>
//                     <option value="sawtooth">Sawtooth</option>
//                     <option value="triangle">Triangle</option>
//                     <option value="custom">Custom</option>
//                 </select>
//             </div>
//         )
//     }
// }

// class VolumeControl extends React.Component {
//     render () {
//         return (
//             <div className="left">
//                 <span>Volume: </span>
//                 <input type="range" min="0.0" max="1.0" step="0.01"
//                     value="0.5" list="volumes" name="volume" />
//                 <datalist id="volumes">
//                     <option value="0.0" label="Mute"></option>
//                     <option value="1.0" label="100%"></option>
//                 </datalist>
//             </div>
//         )
//     }
// }

// class SettingsBar extends React.Component {
//     render () {
//         return (
//             <div className="settingsBar">
//                 <VolumeControl />
//                 <WaveformSelector />
//             </div>
//         )
//     }
// }


function playTone(freq) {
    let osc = audioContext.createOscillator();
    osc.connect(masterGainNode);

    // let type = wavePicker.options[wavePicker.selectedIndex].value;

    // if (type === "custom") {
    //     osc.setPeriodicWave(this.state.customWaveform);
    // } else {
    //     osc.type = this.state.type;
    // }
    osc.type = "sawtooth";

    osc.frequency.value = freq;
    osc.start();

    return osc;
}


class Key extends React.Component {
    constructor(props) {
        super(props)
        let style;

        if (this.props.note.length > 1) {
            style = {backgroundColor: 'black', color: 'white'};
        } else {
            style = {backgroundColor: 'white', color: 'black'};
        }

        this.state = {
            style: style,
            pressed: false,
            oscListIndex: this.props.octave + this.props.note,
            freq: this.props.freq,
            charCode: charCodeToNote[this.props.note][1]
        }

        this.notePressed = this.notePressed.bind(this);
        this.noteReleased = this.noteReleased.bind(this);
        this.noteClicked = this.noteClicked.bind(this);
    }

    notePressed = () => {
        if (!this.state.pressed) {
            oscList[this.state.oscListIndex] = playTone(this.state.freq);
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
            <div 
                className="key"
                style={this.state.style}
                onMouseDown={this.noteClicked}
                onMouseUp={this.noteReleased}
                onMouseLeave={this.noteReleased}
                >
                <div>
                    {this.props.note}
                    <sub>{this.props.octave}</sub>
                </div>
            </div>
        )
    }
}


class Octave extends React.Component {
    createKeys = () => {
        let keys = [];
        for (let i=0; i < noteMap.length; i++) {
            let note = noteMap[i];
            keys.push({
                note: note,
                octave: this.props.octaveID,
                freq: this.props.octaveArray[note],
            },);
        }

        return keys;
    }

    render() {
        const keys = this.createKeys();

        return (
            <div className="octave" octaveid={this.props.octaveID} octaverray={this.props.octaveArray}>
                {keys.map(key => (
                    <Key key={key.octave + key.note} note={key.note} octave={key.octave} freq={key.freq} />
                ))}
            </div>
        )
    }

}


class Keyboard extends React.Component {
    createOctaves = () => {
        let octaves = [];
        for (let i=0; i < this.props.noteFreq.length; i++) {
            octaves.push({
                octaveID: i,
                octaveArray: this.props.noteFreq[i],
            });
        }
        return octaves;
    }

    render() {
        const octaves = this.createOctaves();

        return (
            <div className="keyboard">
                {octaves.map(octave => (
                    <Octave key={octave.octaveID} octaveID={octave.octaveID} octaveArray={octave.octaveArray} />
                ))}
            </div>
        )
    }

}


class MusicBox extends React.Component {
    createNoteTable = () => {
        let noteFreq = [];

        for (let i=0; i<1; i++) {
            noteFreq[i] = [];
            for (let j=0; j<12; j++) {
                let n = (12*i + j); // n is zero when at A5 (440Hz) (i.e. i=5, j=0)
                noteFreq[i][noteMap[j]] = 440 * Math.pow(2, n/12);
            }
        }
        
        return noteFreq
    }

    render() {
        let noteTable = this.createNoteTable();
        return (
            <div>
                <div className="container">
                    <Keyboard noteFreq={noteTable} />
                </div>
                {/* <SettingsBar /> */}
            </div>
        );
    }
}

export default MusicBox;
