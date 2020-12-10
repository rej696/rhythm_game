import React from 'react';
import FourTrack from './backingTrack.js';


export default class Schema {
    constructor(updateRateMS, railHeight, blockSpeed) {
        const trackClockOffset = - Math.floor(railHeight / (blockSpeed));
        console.log(trackClockOffset);
        const triggerFreqs = [40, 160, 320, 100];
        this.trackTriggers = [];
        this.blockTriggers = [];
        for (let i in triggerFreqs) {
            this.blockTriggers.push(new Trigger(triggerFreqs[i], 0));
            this.trackTriggers.push(new Trigger(triggerFreqs[i], trackClockOffset));
        }
    }

    update() {
        for (let i in this.trackTriggers) {
            this.trackTriggers[i].update();
            this.blockTriggers[i].update();
        }
    }
}

class Trigger {
    constructor(freq, clockInitial) {
        this.freq =  freq;
        this.value = false;
        this.clock = clockInitial;
    }

    update() {
        this.clock += 1;
        if (this.clock < 0) {
            this.value = false;
            console.log('value is false');
        }
        else {
            this.value = (this.clock % this.freq === 0);
        }
    }
}