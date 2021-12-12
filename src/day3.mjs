/**
 * --- Day 3: Binary Diagnostic ---

The submarine has been making some odd creaking noises, so you ask it to produce a diagnostic report just in case.

The diagnostic report (your puzzle input) consists of a list of binary numbers which, when decoded properly, can tell you many useful things about the conditions of the submarine. The first parameter to check is the power consumption.

You need to use the binary numbers in the diagnostic report to generate two new binary numbers (called the gamma rate and the epsilon rate). The power consumption can then be found by multiplying the gamma rate by the epsilon rate.

Each bit in the gamma rate can be determined by finding the most common bit in the corresponding position of all numbers in the diagnostic report. For example, given the following diagnostic report:

00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010

Considering only the first bit of each number, there are five 0 bits and seven 1 bits. Since the most common bit is 1, the first bit of the gamma rate is 1.

The most common second bit of the numbers in the diagnostic report is 0, so the second bit of the gamma rate is 0.

The most common value of the third, fourth, and fifth bits are 1, 1, and 0, respectively, and so the final three bits of the gamma rate are 110.

So, the gamma rate is the binary number 10110, or 22 in decimal.

The epsilon rate is calculated in a similar way; rather than use the most common bit, the least common bit from each position is used. So, the epsilon rate is 01001, or 9 in decimal. Multiplying the gamma rate (22) by the epsilon rate (9) produces the power consumption, 198.

Use the binary numbers in your diagnostic report to calculate the gamma rate and epsilon rate, then multiply them together. What is the power consumption of the submarine? (Be sure to represent your answer in decimal, not binary.)
*/
import * as R from 'ramda';
import { readFileToStream } from './utils/read.mjs';
import test from 'tape';

// String -> N
const N = (n) => ({
    map(fn) {
        return N(fn(n));
    },

    zip(other) {
        return other.map(otherNumber => ([n, otherNumber]));
    },

    join() {
        return R.join('', n);
    },

    toDecimal() {
        return parseInt(this.join(), 2);
    },
});

N.of = x => N(R.map(Number, R.split('', x)));
N.from = (length, val) => N(new Array(length).fill(val));

// Number -> Number
const add = (a, b) => a + b;

// N -> N -> N
const addNumbers = (n1, n2) => {
    return n1.zip(n2).map(R.apply(R.zipWith(add)));
};

// N -> Number -> N
const getBinaryFromFrequencyDecimal = (n, total) => {
    return n.map(digits => {
        return digits.map(d => +(d > total / 2));
    });
};

// N -> N
const invertBinary = n => {
    return n.map(digits => digits.map(d => +!d));
};

// N -> N -> Number
const getPowerConsumption = (gammaRate, epsilonRate) => {
    return gammaRate.toDecimal() * epsilonRate.toDecimal();
};


// String -> Number -> Number
const getPowerConsumptionFromFile = (path, digitsLength) => {
    const stream = readFileToStream(path);
    let total = 0;
    let onesFrequencyNumber = N.from(digitsLength, 0);

    return new Promise((resolve, reject) => {
        stream.on('line', line => {
            total++;

            onesFrequencyNumber = addNumbers(onesFrequencyNumber, N.of(line));
        });

        stream.on('close', () => {
            const gamma = getBinaryFromFrequencyDecimal(onesFrequencyNumber, total);
            const epsilon = invertBinary(gamma);

            resolve(getPowerConsumption(gamma, epsilon));
        });

        stream.on('error', (ex) => {
            console.log(ex);
            reject(ex);
        });
    });
};

test('Day3 tests', async t => {
    {
        const n1 = N.of('111');
        const n2 = N.of('222');

        const resN = addNumbers(n1, n2);

        t.same(resN.join(), '333', 'Given 111 and 222, addNumbers must return 333');
    }

    {
        const n = N.of('012456');
        const total = 6;
        
        const resN = getBinaryFromFrequencyDecimal(n, total);

        t.same(resN.join(), '000111', 'Given a ones frequency number, getBinaryFromFrequencyDecimal must return the correct anwser');
        t.same(resN.toDecimal(), 7, 'Calling toDecimal must convert the N to decimal');
        t.same(invertBinary(resN).join(), '111000', 'Given a binary, invertBinary must convert 1 to 0 and viceversa');
    }

    {
        const powerConsumption = await getPowerConsumptionFromFile('./data/day3.example.txt', 5);

        t.same(powerConsumption, 198, 'Example result must be 198');
    }
    {
        const powerConsumption = await getPowerConsumptionFromFile('./data/day3.txt', 12);

        console.log('Day 3 result: ', powerConsumption);
    }

    t.end();
});