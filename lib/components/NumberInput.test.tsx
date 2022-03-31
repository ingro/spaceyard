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

    // FIXME: per qualche motivo dopo l'aggiornamento a React 18 non viene più triggherata la callback "onChange",
    // potrebbe derivare da un errore lanciato da React che avvisa che qualche componente del NumerInput utilizza ancora
    // ReactDOM.render, aspettare aggiornamenti relativi e riprovare

    // @ts-ignore
    user.type(input, '12{enter}');
    // @ts-ignore
    // fireEvent.blur(input);

    await pause(100);

    // console.log(prettyDOM(container));

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
