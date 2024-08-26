import {describe, expect, it, vi} from "vitest";
import {fireEvent, render} from '@testing-library/svelte';
import Listing from "src/components/coffee/Listing.svelte";
import {CoffeeApiService} from "src/lib/services/CoffeeApiService";

vi.mock('src/lib/services/CoffeeApiService');

describe('Listing Component', () => {
    it('should load more items when button is clicked', async () => {
        const {getByText} = render(Listing);
        const addItemButton = getByText('Load more');
        await fireEvent.click(addItemButton);
        expect(CoffeeApiService.addToCollection).toHaveBeenCalled();
    });
});