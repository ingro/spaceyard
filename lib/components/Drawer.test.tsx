import React from 'react';
import { render, screen } from '@testing-library/react';

import { Drawer } from './Drawer';

const pause = (ms: number) => new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
});

test('basic Drawer tests', async () => {
    render(
        <Drawer
            isOpen={true}
            onClose={() => {}}
        >
            <h1>Look I'm inside a Drawer</h1>
        </Drawer>
    );

    // Added a short pause to let the animation finish, otherwise the drawer starts
    // with opacity = 0 and thus is not visible 
    await pause(100);

    const text = await screen.getByText('Look I\'m inside a Drawer');

    expect(text).toBeVisible();
});
