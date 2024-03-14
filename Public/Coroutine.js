/**
 * @module Coroutine
 * @description Script module which provides coroutine feature for Lens Studio.
 * @author Snap Inc
 * @version 1.1.0
 */


/**

// Assuming this script is attached to a ScriptComponent in Lens Studio
const coroutineModule = require('Coroutine');
const CoroutineManager = coroutineModule.CoroutineManager;
const waitForEndOfFrame = coroutineModule.waitForEndOfFrame;
const waitForSeconds = coroutineModule.waitForSeconds;

// Initialize CoroutineManager
// You must pass the reference to this scriptComponent when constructing a coroutine manager
const coroutineManager = new CoroutineManager(script);

// Example coroutine function using waitForSeconds and waitForEndOfFrame
function* simpleCoroutine() {
    print("Coroutine Started");

    // Wait for 2 seconds
    yield* waitForSeconds(2);
    print("Waited for 2 seconds");

    // Wait until the end of the frame
    yield* waitForEndOfFrame();
    print("Reached end of frame");

    print("Coroutine Ended");
}

// Start the coroutine
coroutineManager.startCoroutine(simpleCoroutine);

// Other available functions in the Coroutine module (not used in this example):
// - waitTill(condition): Waits until a specified condition is true
// - waitForVideoPlayEnds(videoTextureProvider): Waits until a video playback ends

// Destroy CoroutineManager when no longer needed
// coroutineManager.destroy(); // Uncomment this line to destroy CoroutineManager when required


*/
  


/**
 * @public
 */
class CoroutineManager {
    /**
     * 
     * @param {ScriptComponent} script 
     */
    constructor(script) {
        /** @type {Iterator[]} */
        this.coroutines = [];
        /** @type {Iterator[]} */
        this.inactiveCoroutines = [];
        this.updateEvent = script.createEvent("UpdateEvent");
        this.updateEvent.bind(this.update.bind(this));
    }
    /**
     * @public
     */
    destroy() {
        script.removeEvent(this.updateEvent);
        this.coroutines = [];
        this.inactiveCoroutines = [];
    }

    /**
     * @public
     * @param {Function} generatorFn 
     * @param  {...any} args
     * @returns {Iterator}
     */
    startCoroutine(generatorFn, ...args) {
        if (!generatorFn) {
            return;
        }
        const iterator = generatorFn(...args);
        this.coroutines.push(iterator);
        return iterator;
    }
    /**
     * @public
     * @param {Iterator} iterator 
     */
    stopCoroutine(iterator) {
        const index = this.coroutines.indexOf(iterator);
        if (index > -1) {
            this.coroutines.splice(index, 1);
        }
    }
    /**
     * @public
     * @param {Iterator} iterator 
     */
    pauseCoroutine(iterator) {
        const index = this.coroutines.indexOf(iterator);
        if (index > -1) {
            //remove it from coroutine array
            this.coroutines.splice(index, 1);
            //add to inactive coroutines
            this.inactiveCoroutines.push(iterator);
        }
    }
    /**
     * @public
     * @param {Iterator} iterator 
     */
    resumeCoroutine(iterator) {
        //check if it exists in the active coroutines
        const index = this.coroutines.indexOf(iterator);
        if (index > -1) {
            print("WARN: Coroutine is already active");
            return;
        }
        //check if it exists in the inactive coroutines
        const inactiveIndex = this.inactiveCoroutines.indexOf(iterator);
        if (inactiveIndex > -1) {
            //remove it from the inactive coroutines
            this.inactiveCoroutines.splice(inactiveIndex, 1);
        } else {
            print("WARN: Coroutine is not paused");
        }
        //add it to the active coroutines
        this.coroutines.push(iterator);
    }

    /**
     * @private
     */
    update() {
        for (let i = 0; i < this.coroutines.length; i++) {
            const coroutine = this.coroutines[i];
            const result = coroutine.next();
            if (result.done) {
                // remove the coroutine from the list
                this.coroutines.splice(i, 1);
                i--;
            }
        }
    }

}

/**
 * A generator function that yields control to the caller until the end of the current frame.
 * 
 * @public
 * @generator
 * @function
 * @yields {undefined}
 */
function* waitForEndOfFrame() {
    yield;
}

/**
 * A generator function that yields control to the caller until the specified number of seconds has elapsed.
 * @public
 * @generator
 * @function
 * @param {number} seconds - The number of seconds to wait for.
 * @yields {undefined} An empty iterable value to indicate that the specified number of seconds has elapsed.
 */
function* waitForSeconds(seconds) {
    const start = getTime();
    const target = start + seconds;
    while (getTime() < target) {
        yield;
    }
}

/**
 * @public
 * @generator
 * @function
 * @param {()=>Boolean} condition 
 * @yields {undefined}
 */
function* waitTill(condition) {
    while (!condition()) {
        yield;
    }
}

/**
 * @public
 * @generator
 * @function
 * @param {VideoTextureProvider} videoTextureProvider 
 * @yields {undefined}
 */
function* waitForVideoPlayEnds(videoTextureProvider) {
    while (videoTextureProvider.status !== VideoStatus.Stopped) {
        yield;
    }
}

module.exports = {
    CoroutineManager,
    waitForEndOfFrame,
    waitForSeconds,
    waitForVideoPlayEnds,
    waitTill
};
