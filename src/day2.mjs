import * as R from 'ramda';
import { readFileToStream } from './utils/read.mjs';
import test from 'tape';

/*
Now, you need to figure out how to pilot this thing.

It seems like the submarine can take a series of commands like forward 1, down 2, or up 3:

    forward X increases the horizontal position by X units.
    down X increases the depth by X units.
    up X decreases the depth by X units.

Note that since you're on a submarine, down and up affect your depth, and so they have the opposite result of what you might expect.

The submarine seems to already have a planned course (your puzzle input). You should probably figure out where it's going. For example:

forward 5
down 5
forward 8
up 3
down 8
forward 2

Your horizontal position and depth both start at 0. The steps above would then modify them as follows:

    forward 5 adds 5 to your horizontal position, a total of 5.
    down 5 adds 5 to your depth, resulting in a value of 5.
    forward 8 adds 8 to your horizontal position, a total of 13.
    up 3 decreases your depth by 3, resulting in a value of 2.
    down 8 adds 8 to your depth, resulting in a value of 10.
    forward 2 adds 2 to your horizontal position, a total of 15.

After following these instructions, you would have a horizontal position of 15 and a depth of 10. (Multiplying these together produces 150.)

Calculate the horizontal position and depth you would have after following the planned course. What do you get if you multiply your final horizontal position by your final depth?
*/

// type State = { depth: Number, horizontal: Number };
// type Action = { type: String, payload: Number }
// ReadableStream -> Promise(State)
const getSubmarineStateByStream = stream => {

    // State -> Action -> State
    const reducer = (state, action) => {
        switch(action.type) {
            case 'forward': return { ...state, horizontal: state.horizontal + action.payload };
            case 'down': return { ...state, depth: state.depth + action.payload };
            case 'up': return { ...state, depth: state.depth - action.payload };
            default: return state;
        }
    };

    // Array([String, String]) -> Action
    const createAction = ([type, payload]) => ({
        type,
        payload: Number(payload),
    });

    // String -> Action
    const getActionFromLine = R.compose(createAction, R.split(' '));

    // State
    let state = {
        horizontal: 0,
        depth: 0,
    };

    return new Promise((resolve, reject) => {
        stream.on('line', line => {
            state = reducer(state, getActionFromLine(line));
        });

        stream.on('close', () => {
            resolve(state);
        });

        stream.on('error', (ex) => {
            console.log(ex);
            reject();
        });
    });
};

// State -> Number
const getResultByState = state => state.horizontal * state.depth;

test('Day 2 tests', async t => {
    {
        const stream = readFileToStream('./data/day2.example.txt');
        const state = await getSubmarineStateByStream(stream);
        const res = getResultByState(state);

        t.same(res, 150, 'Example result must be 150');
    }

    {
        const stream = readFileToStream('./data/day2.txt');
        const state = await getSubmarineStateByStream(stream);
        const res = getResultByState(state);

        console.log('Day 2 result: ', res);
    }

    t.end();
});