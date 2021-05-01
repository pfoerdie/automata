const
    model = require('.'),
    util = require('@pfoerdie/utility');

module.exports = class StateMachine extends model.State {

    #states = new Set();

    constructor() { }

};