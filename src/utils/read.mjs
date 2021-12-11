import { createReadStream } from 'fs';
import Stream from 'stream';
import readline from 'readline';

// String -> fs.ReadStream
const openFile = path => createReadStream(path, { encoding: 'utf-8' });

// String -> Promise(Array(String))
export const readFileToArray = path => new Promise((resolve, reject) => { 
    const input = openFile(path);
    const reader = readline.createInterface({ input });

    const res = [];

    reader.on('line', line => {
        res.push(line);
    });

    reader.on('close', () => {
        resolve(res);
    });

    reader.on('error', reject);
});

// String -> ReadableStream
export const readFileToStream = path => {
    const input = openFile(path);
    const reader = readline.createInterface({ input });

    return reader;
};