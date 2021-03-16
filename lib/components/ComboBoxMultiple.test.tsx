import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import user from '@testing-library/user-event';

import { ComboBoxMultiple } from './ComboBoxMultiple';

export const pause = (ms: number) =>  new Promise(resolve => setTimeout(resolve, ms));

test('basic ComboBoxMultiple functionality', async () => {
    const options = [
        { value: 'foo', label: 'Foo' }, 
        { value: 'bar', label: 'Bar' },
        { value: 'aaa', label: 'Aaa' },
        { value: 'xyz', label: 'XYZ' },
        { value: 'bbb', label: 'bbb' },
        { value: 'ccc', label: 'ccc' },
        { value: 'ddd', label: 'ddd' },
        { value: 'eee', label: 'eee' }
    ];

    const onChange = jest.fn();

    let result;

    // Popper crea problemi altrimenti, vedi https://github.com/popperjs/react-popper/issues/350
    // e https://github.com/popperjs/react-popper/commit/76822a25ebb87592ad7faea7c3c407f5be1f2da0
    await act(async () => {
        result = await render(
            <ComboBoxMultiple
                options={options}
                onChange={onChange}
            />        
        );
    });

    const { container, rerender } = result;

    const cbToggle = container.querySelector('[data-combobox-toggle]');

    fireEvent.click(cbToggle);

    let cbOptions = screen.getAllByRole('option');

    expect(cbOptions.length).toEqual(8);

    const firstOption = await screen.getByText('Foo').parentElement;

    expect(firstOption).toHaveAttribute('role', 'option');
    expect(firstOption).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(firstOption);

    await pause(100);

    cbOptions = screen.getAllByRole('option');

    expect(cbOptions.length).toEqual(7);

    expect(onChange).toHaveBeenCalledWith([{ value: 'foo', label: 'Foo'}]);

    rerender(
        <ComboBoxMultiple
            value={[{ value: 'foo', label: 'Foo'}]}
            options={options}
            onChange={onChange}
        /> 
    );

    const selectedItem = container.querySelector('[data-selected-item="0"]');

    expect(selectedItem).toBeInTheDocument();
    expect(selectedItem).toHaveTextContent('Foo');

    const removeItemBtn = container.querySelector('[data-remove-item="0"]');

    fireEvent.click(removeItemBtn);

    expect(onChange).toHaveBeenCalledWith([]);

    rerender(
        <ComboBoxMultiple
            value={[]}
            options={options}
            onChange={onChange}
        /> 
    );

    const input = container.querySelector('input[type="text"]');

    user.type(input, 'a');

    // console.log(prettyDOM(container));

    cbOptions = screen.getAllByRole('option');

    expect(cbOptions.length).toEqual(2);

    expect(cbOptions[0]).toHaveTextContent('Aaa');
    expect(cbOptions[1]).toHaveTextContent('Bar');
});