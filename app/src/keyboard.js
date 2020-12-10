import React from 'react';
//allow use of react hooks
//import { useState, useEffect } from 'react';
import MusicTrack from './backingTrack.js';

const keycodeA = 65;
const keycodeS = 83;
const keycodeD = 68;
const keycodeF= 70;

let keyboardToRailMap = {
    keycodeA : rail[0],
    keycodeS : rail[1],
    keycodeD : rail[2],
    keyCodeF : rail[3]
}

function playNote(chord) {
    console.log(chord)
}

//MVP: play certain note when press certain key
function processKeyPress(keycode) {
    if (keycode === 65) {
        playNote('a')
    }
    if (keycode === 83) {
        playNote('c')
    }
    if (keycode === 68) {
        playNote('d')
    }
    if (keycode === 70) {
        playNote('f')
    }
}

