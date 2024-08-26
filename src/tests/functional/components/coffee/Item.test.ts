import {act, fireEvent, render} from '@testing-library/svelte';
import CoffeeItem from 'src/components/coffee/Item.svelte';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {CoffeeApiService} from 'src/lib/services/CoffeeApiService';
import {Coffee} from "src/lib/interfaces/Coffee";
import '@testing-library/jest-dom/vitest';

describe('CoffeeItem', () => {
    const mockCoffee: Coffee = {
        id: 1,
        uid: 'uid-1',
        blend_name: 'Test Blend',
        origin: 'Test Origin',
        variety: 'Test Variety',
        intensifier: 'Test Intensifier',
        notes: 'Note1, Note2, Note3',
        is_should_reload: false,
    };

    const mockImageUrl = 'https://example.com/coffee.jpg';

    beforeEach(() => {
        const mockIntersectionObserver = vi.fn();
        mockIntersectionObserver.mockReturnValue({
            observe: () => vi.fn(),
            unobserve: () => vi.fn(),
            disconnect: () => vi.fn(),
        });
        window.IntersectionObserver = mockIntersectionObserver;
    });

    CoffeeApiService.getImageUrlByCoffee = vi.fn(() => mockImageUrl);

    it('should display coffee details correctly', () => {
        const {getByText} = render(CoffeeItem, {coffee: mockCoffee});

        expect(getByText(mockCoffee.blend_name)).toBeInTheDocument();
        expect(getByText(mockCoffee.origin)).toBeInTheDocument();
        expect(getByText(mockCoffee.variety)).toBeInTheDocument();
        expect(getByText(mockCoffee.intensifier)).toBeInTheDocument();
        mockCoffee.notes.split(',').forEach(note => {
            expect(getByText(note.trim())).toBeInTheDocument();
        });
    });

    it('should set the correct image src and lazy load it', () => {
        const {container} = render(CoffeeItem, {coffee: mockCoffee});
        const img = container.querySelector('.image-main') as HTMLImageElement;

        expect(img).toHaveAttribute('data-src', mockImageUrl);
        expect(img).not.toHaveAttribute('src', mockImageUrl);
    });

    it('should remove invisible class after image load', async () => {
        const {container} = render(CoffeeItem, {coffee: mockCoffee});
        const img = container.querySelector('.image-main') as HTMLImageElement;

        await act(() =>
            fireEvent.load(img)
        );

        await fireEvent.load(img);
        expect(img.classList.contains('invisible')).toBe(false);
    });
});