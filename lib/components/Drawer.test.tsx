import React from 'react';
import { render, screen } from '@testing-library/react';

import { Drawer } from './Drawer';

test('basic Drawer tests', async () => {
    render(
        <Drawer
            isOpen={true}
            onClose={() => {}}
        >
            <h1>Look I'm inside a Drawer</h1>
        </Drawer>
    );

    await screen.getByText('Look I\'m inside a Drawer');
});
