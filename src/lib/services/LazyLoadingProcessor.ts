export class LazyLoadingProcessor
{
    static #instance: LazyLoadingProcessor;

    readonly #io: IntersectionObserver;

    constructor() {
        this.#io = new IntersectionObserver(this.updateImageSource);
    }

    /**
     * IntersectionObserver getter
     */
    get io(): IntersectionObserver {
        return this.#io;
    }

    /**
     * Get singleton instance
     */
    public static get instance(): LazyLoadingProcessor {
        if (!LazyLoadingProcessor.#instance) {
            LazyLoadingProcessor.#instance = new LazyLoadingProcessor();
        }

        return LazyLoadingProcessor.#instance;
    }

    /**
     * Update all visible in viewport images with the real sources
     *
     * @private
     */
    private updateImageSource(entries: Array<IntersectionObserverEntry>): void
    {
        entries.forEach((entry: IntersectionObserverEntry & {target: HTMLImageElement}) => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
            }
        });
    }
}