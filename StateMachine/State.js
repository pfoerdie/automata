const
    model = require('.'),
    util = require('@pfoerdie/utility'),
    EventEmitter = require('events');

module.exports = class State extends EventEmitter {

    /** @type {Map<model.State, function>} [S] [delta] */
    #transitions = new Map();

    constructor(data = null) {
        super();
        this.data = data;
    }

    /**
     * @param {model.State} state 
     * @param {function(...any): any} transition 
     * @returns {this}
     */
    addState(state, transition) {
        util.assert.function(transition);
        util.assert.instance(state, model.State);
        util.assert(!this.#transitions.has(state));
        this.#transitions.set(state, transition);
        return this;
    }

    /**
     * @param {model.State} state 
     * @returns {boolean}
     */
    removeState(state) {
        util.assert.instance(state, model.State);
        return this.#transitions.delete(state);
    }

    /**
     * @param  {...any} inputs 
     * @returns {any}
     */
    compute(...inputs) {
        util.assert(inputs.length > 0);
        for (let [state, transition] of this.#transitions) {
            const output = transition.apply(this, inputs);
            if (output === undefined) continue;
            this.emit('transition', state);
            return output;
        }
    }

};