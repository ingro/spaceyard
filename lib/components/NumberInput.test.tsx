import React from 'react';
import { render, screen, fireEvent, act, prettyDOM } from '@testing-library/react';
import user from '@testing-library/user-event';

import { NumberInput } from './NumberInput';

const pause = (ms: number) =>  new Promise(resolve => setTimeout(resolve, ms));

test('basic NumberInput functionality', async () => {
    const onChange = jest.fn();

    const { container } = render(
        <NumberInput
            onChange={onChange}
        />        
    );

    const input = container.querySelector('input[type="text"]');

    // @ts-ignore
    user.type(input, '12');
    // @ts-ignore
    fireEvent.blur(input);

    await pause(100);

    expect(onChange).toHaveBeenCalledWith(12);

    expect(input).toHaveDisplayValue('12');

    // @ts-ignore
    user.clear(input);
    // @ts-ignore
    fireEvent.blur(input);

    await pause(100);

    expect(onChange).toHaveBeenCalledWith(NaN);

    expect(input).toHaveDisplayValue('');

    // @ts-ignore
    user.type(input, 'abcdef');
    // @ts-ignore
    fireEvent.blur(input);

    await pause(100);

    // console.log(prettyDOM(input));

    expect(input).toHaveDisplayValue('');
});
