import {beforeEach, describe, expect, it, vi} from 'vitest';
import {CoffeeApiService} from 'src/lib/services/CoffeeApiService';
import {get, writable} from 'svelte/store';
import type {Coffee} from 'src/lib/interfaces/Coffee';

const mockCoffee: Coffee = {
    id: 1,
    uid: 'uid-string',
    blend_name: 'Morning Blend',
    origin: 'Colombia',
    variety: 'Arabica',
    notes: 'Nutty, Sweet',
    intensifier: 'Smooth',
    is_should_reload: false,
};

describe('CoffeeApiService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getImageUrlByCoffee', () => {
        it('should return a valid image URL based on Coffee blend_name', () => {
            const url = CoffeeApiService.getImageUrlByCoffee(mockCoffee);
            expect(url).toMatch(/https:\/\/loremflickr.com\/526\/298\/morning,blend\/all\?random=\d+.\d+/);
        });
    });

    describe('clearDuplicates', () => {
        it('should remove duplicates from the collection by coffee ID', () => {
            const collectionStore = writable<Coffee[]>([mockCoffee, {...mockCoffee, id: 2}]);

            let collection: Array<Coffee>;
            collectionStore.subscribe(value => collection = value);

            CoffeeApiService.clearDuplicates(collectionStore, mockCoffee.id);

            expect(collection).toEqual([{...mockCoffee, id: 2}]);
        });

        it('should keep original collection if duplicates not found', () => {
            const collectionStore = writable<Coffee[]>([mockCoffee, {...mockCoffee, id: 2}]);

            let collection: Array<Coffee>;
            collectionStore.subscribe(value => collection = value);

            CoffeeApiService.clearDuplicates(collectionStore, 3);

            expect(collection).toEqual([mockCoffee, {...mockCoffee, id: 2}]);
        });
    });

    describe('addToCollection', () => {
        it('should add a coffee item to the collection and change loading state', async () => {
            const collectionStore = writable<Coffee[]>([]);
            const loadingStatusStore = writable(false);

            vi.spyOn(CoffeeApiService, 'getProduct').mockResolvedValue(mockCoffee);

            CoffeeApiService.addToCollection(collectionStore, loadingStatusStore);
            expect(get(loadingStatusStore)).toBe(true);

            await new Promise(resolve => setTimeout(resolve, 0));

            expect(get(collectionStore)).toEqual([mockCoffee]);
            expect(get(loadingStatusStore)).toBe(false);
        });

        it('should mark the coffee item as should reload on error', async () => {
            const emptyCoffee = {is_should_reload: false} as Coffee;

            const collectionStore = writable<Coffee[]>([emptyCoffee]);
            const loadingStatusStore = writable(false);

            vi.spyOn(CoffeeApiService, 'getProduct').mockRejectedValue(new Error('Network error'));

            CoffeeApiService.addToCollection(collectionStore, loadingStatusStore, emptyCoffee);

            await new Promise(resolve => setTimeout(resolve, 0));

            expect(get(collectionStore)).toEqual([emptyCoffee]);
            expect(emptyCoffee.is_should_reload).toBe(true);
        });
    });
});