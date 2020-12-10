let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscList = [];
let masterGainNode = null;

let keyboard = document.querySelector(".keyboard");
let wavePicker = document.querySelector("select[name='waveform']");
let volumeControl = document.querySelector("input[name='volume']");

let noteFreq = null;
let customWaveform = null;
let sineTerms = null;
let cosineTerms = null;

let noteMap = {
    0: "A",
    1: "Bb",
    2: "B",
    3: "C",
    4: "C#",
    5: "D",
    6: "Eb",
    7: "E",
    8: "F",
    9: "F#",
    10: "G",
    11: "G#",
};

function createNoteTable() {
    let noteFreq = [];
    for (let i=0; i<9; i++) {
        noteFreq[i] = [];
        for (let j=0; j<12; j++) {
            let n = (12*i + j) - 12*5; // n is zero when at A5 (440Hz) (i.e. i=5, j=0)
            noteFreq[i][noteMap[j]] = 440 * Math.pow(2, n/12);
        }
    }
    
    return noteFreq
}

function notePressed(event) {
    if (event.buttons & 1) {
        let dataset = event.target.dataset;

        if (!dataset["pressed"]) {
            oscList[dataset["octave"][dataset["note"]]] = playTone(dataset["frequency"]);
            dataset["pressed"] = "yes";
        }
    }
}

function noteReleased(event) {
    let dataset = event.target.dataset;
    if (dataset && dataset["pressed"]) {
        oscList[dataset["octave"][dataset["note"]]].stop();
        oscList[dataset["octave"][dataset["note"]]] = null;
        delete dataset["pressed"];
    }
}

function playTone(freq) {
    let osc = audioContext.createOscillator();
    osc.connect(masterGainNode);

    let type = wavePicker.options[wavePicker.selectedIndex].value;

    if (type === "custom") {
        osc.setPeriodicWave(customWaveform);
    } else {
        osc.type = type;
    }

    osc.frequency.value = freq;
    osc.start();

    return osc;
}

function createKey(note, octave, freq) {
    let keyElement = document.createElement("div");
    let labelElement = document.createElement("div");

    keyElement.className = "key";

    if (note.length > 1) {
        keyElement.style.backgroundColor = "black";
        keyElement.style.color = "white";
    }

    keyElement.dataset["octave"] = octave;
    keyElement.dataset["note"] = note;
    keyElement.dataset["frequency"] = freq;

    labelElement.innerHTML = note + "<sub>" + octave + "</sub>";
    keyElement.appendChild(labelElement);

    keyElement.addEventListener("mousedown", notePressed, false);
    keyElement.addEventListener("mouseup", noteReleased, false);
    keyElement.addEventListener("mouseover", notePressed, false);
    keyElement.addEventListener("mouseleave", noteReleased, false);

    return keyElement;
}

function changeVolume(event) {
    masterGainNode.gain.value = volumeControl.value
}

function setup() {
    noteFreq = createNoteTable();
    
    volumeControl.addEventListener("change", changeVolume, false);

    masterGainNode = audioContext.createGain();
    masterGainNode.connect(audioContext.destination);
    masterGainNode.gain.value = volumeControl.value;

    noteFreq.forEach((keys, idx) => {
        let keyList = Object.entries(keys);
        let octaveElem = document.createElement('div');
        octaveElem.className = "octave";

        keyList.forEach((key) => {
            octaveElem.appendChild(createKey(key[0], idx, key[1]));
        });

        keyboard.appendChild(octaveElem)
    });

    document.querySelector("div[data-note='B'][data-octave='6']").scrollIntoView(false);

    sineTerms = new Float32Array([0, 0, 1, 0, 1]);
    cosineTerms = new Float32Array(sineTerms.length);
    customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);

    for (let i=0; i<9; i++) {
        oscList[i] = [];
    }
}

setup();
