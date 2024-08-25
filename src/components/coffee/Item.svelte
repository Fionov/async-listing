<script lang="ts">
    import {Coffee} from "src/lib/interfaces/Coffee";
    import {onMount} from "svelte";
    import {CoffeeApiService} from "src/lib/services/CoffeeApiService";
    import {LazyLoadingProcessor} from "src/lib/services/LazyLoadingProcessor";

    let image: HTMLImageElement;

    export let coffee: Coffee;

    onMount(() => {
        image.onload = (event: Event & { target: HTMLImageElement }) => {
            event.target.classList.remove('invisible');
        }
        LazyLoadingProcessor.instance.io.observe(image);
    })
</script>

<div class="coffee-list__item">
    <div class="image-block">
        <a href="/">
            <img class="image-placeholder" src="/images/coffee-placeholder.webp" alt={coffee.blend_name} />
            <img bind:this={image}
                 data-src={CoffeeApiService.getImageUrlByCoffee(coffee)}
                 alt="{coffee.blend_name}"
                 class="image-main invisible"
            />
            <div class="item-intensifier">
                {coffee.intensifier}
            </div>
        </a>
    </div>
    <div class="item-details">
        <div class="item-details__label lines-clamp-1">
            {coffee.origin}
        </div>
        <div class="item-details__name lines-clamp-2">
            <a href="/">
                {coffee.blend_name}
            </a>
        </div>
        <div class="item-details__variety lines-clamp-2">
            {coffee.variety}
        </div>
        <div class="item-details__notes">
            <div class="notes-wrapper">
                <div class="notes-list">
                    {#each (coffee.notes.split(',')) as note}
                        <span class="notes-list__item">{note}</span>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="less">
    @import "src/styles/coffee/listing-item";
    @import "src/styles/mixins/animations";

    .coffee-list__item {
        .image-block:hover + .item-details .item-details__name a {
            color: @text-blue;
        }

        img.image-placeholder {
            .animation-pulse(opacity);
            background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(200, 200, 200, 1) 100%);
        }

        img.image-main {
            position: absolute;
            transition: opacity;
            transition-duration: @transition-fast;
            left: 0;
            top: 0;

            &.invisible {
                opacity: 0;
            }
        }
    }
</style>