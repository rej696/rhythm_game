import React from 'react';
import FourTrack from './backingTrack.js';


export default class Schema {
    constructor(updateRateMS, railHeight, blockSpeed) {
        const trackClockOffset = - Math.floor(railHeight / (blockSpeed * updateRateMS));
        const triggerFreqs = [40, 160, 320, 100];
        this.trackTriggers = [];
        this.blockTriggers = [];
        for (let i in triggerFreqs) {
            this.blockTriggers.push(new Trigger(triggerFreqs[i], 0));
            this.trackTriggers.push(new Trigger(triggerFreqs[i], trackClockOffset));
        }
    }

    update() {
        // this.blockClock += 1;
        // this.trackClock += 1;
        for (let i in this.trackTriggers) {
            this.trackTriggers[i].update();
            this.blockTriggers[i].update();
        }
    }

    render() {
        // const triggerFreqs = [40, 160, 320, 100];
        // for (const freq in triggerFreqs) {
        //     this.trackTriggers.push(this.createTrigger(freq));
        // }

        return <FourTrack schema={this.trackTriggers} />
    }

    // createTrigger(clock, freq) {
    //     return clock % freq === 0;
    // }
}

class Trigger {
    constructor(freq, clockInitial) {
        this.freq =  freq;
        this.value = false;
        this.clock = clockInitial;
    }

    update() {
        this.clock += 1;
        this.value = this.clock % this.freq === 0;
    }
}