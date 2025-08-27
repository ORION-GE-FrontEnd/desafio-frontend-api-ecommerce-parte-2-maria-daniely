import '@testing-library/jest-dom';

if(global.TextEncoder === undefined) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { TextEncoder, TextDecoder } = require('util')
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
}