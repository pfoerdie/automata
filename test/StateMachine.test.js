const { State, StateMachine } = require('../StateMachine');

describe('StateMachine', function () {


    test('State#addState, State#compute', function () {
        expect(typeof State).toBe('function');
        expect(typeof StateMachine).toBe('function');
        const s1 = new State('s1'), s2 = new State('s2');
        s1.addState(s2, val => val || undefined);
        s1.addState(s1, val => !val || undefined);
        s2.addState(s1, val => val || undefined);
        s2.addState(s2, val => !val || undefined);
        let si = s1;
        function logTransition(next) {
            console.log('from: ' + si.data + ', to: ' + next.data);
            si = next;
        }
        s1.addListener('transition', logTransition.bind(s1));
        s2.addListener('transition', logTransition.bind(s2));
        si.compute(false);
        si.compute(false);
        si.compute(true);
        si.compute(false);
        si.compute(true);
        si.compute(true);
        si.compute(false);
    });

});