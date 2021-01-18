import React from 'react';
import {render} from '@testing-library/react';
import App from './App';
import 'mutationobserver-shim';

//@ts-ignore
global.fetch = jest.fn(() => {
    return Promise.resolve({
        json: () => {
            return {
                hello: "Hello world!",
            }
        },
    });
});

global.window.postMessage = jest.fn(() => {
    return null;
});

test('renders the sampleapp', async () => {
    const app = render(<App/>);
    await app.findAllByDisplayValue("En");
    expect(fetch).toBeCalled();
    const h1 = await app.findAllByText("Hello world!");
    expect(h1[0]).not.toBeNull();
});
