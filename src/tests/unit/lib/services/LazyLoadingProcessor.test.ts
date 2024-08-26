import {beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import {LazyLoadingProcessor} from 'src/lib/services/LazyLoadingProcessor';

describe('LazyLoadingProcessor', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    beforeAll(() => {
        global.IntersectionObserver = vi.fn().mockImplementation((callback, options) => ({
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn(),
        }));
    });

    describe('Singleton behavior', () => {
        it('should return the same instance on multiple calls', () => {
            const instance1 = LazyLoadingProcessor.instance;
            const instance2 = LazyLoadingProcessor.instance;
            expect(instance1).toBe(instance2);
        });
    });
});