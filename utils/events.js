const events = require('events');

let eventEmitter;

module.exports = {
    init: function() {
        // start event emitter cache eventEmitter value
        eventEmitter = new events.EventEmitter(); 
        return eventEmitter;
    },
    getEventEmitter: function() {
        // return previously cached value
        if (!eventEmitter) {
            throw new Error("must call .init() before you can call .getEventEmitter()");
        }
        return eventEmitter;
    }
}