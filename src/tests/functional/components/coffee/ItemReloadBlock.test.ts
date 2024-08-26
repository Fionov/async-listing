import {describe, expect, it, vi} from 'vitest';
import ItemReloadBlock from 'src/components/coffee/ItemReloadBlock.svelte';
import type {Coffee} from 'src/lib/interfaces/Coffee';

import {fireEvent, render} from '@testing-library/svelte';

describe('ItemReloadBlock Component', () => {
    const mockCoffee: Coffee = {
        id: 1,
        uid: 'uid-1',
        blend_name: 'Test Blend',
        origin: 'Test Origin',
        variety: 'Test Variety',
        intensifier: 'Test Intensifier',
        notes: 'Note1, Note2, Note3',
        is_should_reload: true,
    };

    const mockReload = vi.fn();

    it('should render reload block when is_should_reload is true', () => {
        const {container} = render(ItemReloadBlock, {
            props: {
                reload: mockReload,
                coffee: mockCoffee,
            },
        });

        const itemBody = container.querySelector('.reload-block');
        expect(itemBody).toBeInTheDocument();
    });

    it('should not render reload block when is_should_reload is false', () => {
        const {container} = render(ItemReloadBlock, {
            props: {
                reload: mockReload,
                coffee: {...mockCoffee, is_should_reload: false},
            },
        });

        const itemBody = container.querySelector('.reload-block');
        expect(itemBody).not.toBeInTheDocument();
    });

    it('should call reload function when reload button is clicked', async () => {
        const {container} = render(ItemReloadBlock, {
            props: {
                reload: mockReload,
                coffee: mockCoffee,
            },
        });

        const button = container.querySelector('.reload-block button');
        expect(button).toBeInTheDocument();

        await fireEvent.click(button);

        expect(mockReload).toHaveBeenCalledWith(mockCoffee);
    });
});