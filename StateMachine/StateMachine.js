const
    model = require('.'),
    util = require('@pfoerdie/utility');

/**
 * A deterministic finite-state machine or deterministic finite-state acceptor 
 * is a quintuple (Sigma, S, s_{0}, delta, F), where:
 * - [Sigma] is the input alphabet (a finite non-empty set of symbols)
 * - [S] is a finite non-empty set of states
 * - [s_{0}] is an initial state, an element of S
 * - [delta] is the state-transition function delta(S, Sigma): S
 * - [F] is the set of final states, a (possibly empty) subset of S
 * 
 * A finite-state transducer is a sextuple (Sigma, Gamma, S, s_{0}, delta, omega), where:
 * - [Sigma] is the input alphabet (a finite non-empty set of symbols)
 * - [Gamma] is the output alphabet (a finite non-empty set of symbols)
 * - [S] is a finite non-empty set of states
 * - [s_{0}] is the initial state, an element of S
 * - [delta] is the state-transition function delta(S, Sigma): S
 * - [omega] is the output function
 * 
 * @see https://en.wikipedia.org/wiki/Finite-state_machine#Mathematical_model
 */
module.exports = class StateMachine extends model.State {

    /** @type {model.State} [s_{0}] */
    #initialState = null;

    /** @type {model.State} [s_{i}] */
    #currentState = null;

    /** @param {model.State} initialState */
    constructor(initialState) {
        util.assert.instance(initialState, model.State);
        super();
        this.#initialState = initialState;
    }

    /** @type {model.State} */
    get state() { return this.#currentState; }

    /**
     * @param  {...any} inputs 
     * @returns {any}
     */
    compute(...inputs) {
        util.assert(inputs.length > 0);
        if (!this.#currentState) this.#currentState = this.#initialState;
        const changeCurrentState = (state) => {
            util.assert.instance(state, model.State);
            this.#currentState = state;
        };
        this.#currentState.addListener('transition', changeCurrentState);
        const output = this.#currentState.compute(...inputs);
        this.#currentState.removeListener('transition', changeCurrentState);
        if (output === undefined) return super.compute(...input);
        return output;
    }

};