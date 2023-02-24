import { TextEncoder, TextDecoder } from 'util';
// polyfill TextEncoder and TextDecoder as it is supported in browsers but not present in node
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;
