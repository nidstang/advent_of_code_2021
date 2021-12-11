import * as R from 'ramda';
import { readFileToArray } from './utils/read.mjs';
import test from 'tape';

// Array(String) -> Promise(Number)
const countIncreasedMeasurements = measurements => {

    // Array([Number, Number]) -> Array([Number, Number])
    const reducer = ([previous, total], current) => ([current, total + +(current > previous)]);

    return R.compose(R.last, R.reduce(reducer, [undefined, 0]))(measurements);
};

test('Day1 tests', async t => {
    {
        const data = ['199', '200', '208', '210', '200', '207', '240', '269', '260', '263'];
        const res = countIncreasedMeasurements(data.map(Number));

        t.same(res, 7, 'Example input must be 7');
    }

    {
        const data = await readFileToArray('./data/day1.txt');
        const res =  countIncreasedMeasurements(data.map(Number));
        console.log(data.length);

        console.log('Result day1:', res);
    }

    t.end();
});