import React from 'react';
import { render, screen, fireEvent, act, prettyDOM, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NumberInput } from './NumberInput';

const pause = (ms: number) =>  new Promise(resolve => setTimeout(resolve, ms));

// const originalWarn = console.error.bind(console.error);

// beforeAll(() => {
//   console.error = (msg) => 
//     !msg.toString().includes('ReactDOM.render') && originalWarn(msg)
// });

// afterAll(() => {
//   console.error = originalWarn
// });

test('basic NumberInput functionality', async () => {
    const user = userEvent.setup();
    
    const onChange = jest.fn();

    const { container } = render(
        <NumberInput
            onChange={onChange}
        />      
    );

    const input = container.querySelector('input[type="text"]');

    // @ts-ignore
    await user.type(input, '12');
    // @ts-ignore
    fireEvent.blur(input);

    await pause(100);

    expect(onChange).toHaveBeenCalledWith(12);

    expect(input).toHaveDisplayValue('12');

    // @ts-ignore
    await user.clear(input);
    // @ts-ignore
    fireEvent.blur(input);

    await pause(100);

    expect(onChange).toHaveBeenCalledWith(NaN);

    expect(input).toHaveDisplayValue('');

    // @ts-ignore
    await user.type(input, 'abcdef');
    // @ts-ignore
    fireEvent.blur(input);

    await pause(100);

    // console.log(prettyDOM(input));

    expect(input).toHaveDisplayValue('');
});
