import {Coffee} from "src/lib/interfaces/Coffee";
import {Writable} from "svelte/store";
import {isLoading} from "src/stores/CoffeeStore";

const API_URL = 'https://random-data-api.com/api/coffee/random_coffee';
const IMAGE_URL_TEMPLATE = `https://loremflickr.com/526/298/[keywords]/all?random=${Math.random()}`;

type CoffeeApiOptions = {
    retryTimeout?: number,
    maxAttemptsCount?: number,
};

export class CoffeeApiService
{
    private static RETRY_TIMEOUT = 1000;
    private static MAX_ATTEMPTS_COUNT = 10;

    /**
     * Get random image by Coffee Item
     */
    public static getImageUrlByCoffee(coffee: Coffee): string
    {
        let imageKeywords = coffee.blend_name.toLowerCase().split(/[^a-z]/);
            imageKeywords.push('coffee');
            imageKeywords = imageKeywords.slice(0, 2);

        return IMAGE_URL_TEMPLATE.replace('[keywords]', imageKeywords.join(','));
    }

    /**
     * Add Coffee Item to Collection
     */
    public static addToCollection(
        collectionStore: Writable<Coffee[]>,
        loadingStatusStore: Writable<Boolean>,
        coffee: Coffee | null = null,
    ): void {
        loadingStatusStore.set(true);
        if (coffee) {
            coffee.is_should_reload = false;
            collectionStore.update((list) => [...list]);
        } else {
            coffee = {is_should_reload: false} as Coffee;
            collectionStore.update((list) => [...list, coffee]);

        }

        CoffeeApiService.getProduct()
            .then((res) => {
                this.clearDuplicates(collectionStore, res.id);
                Object.assign(coffee, res);
                collectionStore.update((list) => [...list]);
            })
            .catch(() => {
                Object.assign(coffee, {is_should_reload: true});
                collectionStore.update((list) => [...list]);
            })
            .finally(() => {
                loadingStatusStore.set(false);
            });
    }

    /**
     * Validate collection to avoid ID duplications
     */
    public static clearDuplicates(
        collectionStore: Writable<Coffee[]>,
        coffeeId: number
    ): void {
        if (coffeeId) {
            collectionStore.update((list) => [...list.filter(coffee => coffee.id !== coffeeId)]);
        }
    }

    /**
     * Load Coffee Item, retry if failed
     */
    public static async getProduct(options: CoffeeApiOptions | null = {}): Promise<Coffee> | null
    {
        options = {
            ...{retryTimeout: this.RETRY_TIMEOUT, maxAttemptsCount: this.MAX_ATTEMPTS_COUNT},
            ...options
        };

        let retries = 0;
        let result = null;

        while (!result && retries++ < options.maxAttemptsCount) {
            result = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.fetchItem()
                        .then((res) => {
                            resolve(res);
                        })
                        .catch(reject);
                }, retries === 1 ? 0 : options.retryTimeout);
            });
        }
        if (!result) {
            throw new Error('Unable to fetch data Coffee model');
        }

        return result;
    }

    /**
     * Fetch Coffee Item
     *
     * @private
     */
    private static async fetchItem(): Promise<Coffee | null>
    {
        let result: Coffee | null;
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                result = await response.json()
            } else {
                const errorText = await response.text();
                result = null;
            }
        } catch (error) {
            result = null;
        }

        return result;
    }
}