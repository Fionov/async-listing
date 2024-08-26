<script lang="ts">
    import Item from "src/components/coffee/Item.svelte";
    import {onDestroy, onMount} from "svelte";
    import {CoffeeApiService} from "src/lib/services/CoffeeApiService";
    import {Coffee} from "src/lib/interfaces/Coffee";
    import ItemPlaceholder from "src/components/coffee/ItemPlaceholder.svelte";
    import Spinner from "src/components/Spinner.svelte";
    import { coffeeList, isLoading } from "src/stores/CoffeeStore";

    const AUTO_ADD_TIMEOUT = 5000;
    const MAX_AUTO_LOADED_ITEMS = 100;

    let timer: NodeJS.Timeout | null;

    onMount(async () => {
        autoAddStart();
    });

    onDestroy(() => {
        autoAddStop();
    });

    /**
     * Load new Coffee Item and add to collection
     */
    function loadItem(
        coffee: Coffee | null = null,
    ): void {
        if (!$isLoading) {
            CoffeeApiService.addToCollection(coffeeList, isLoading, coffee);
        }
    }

    /**
     * Start to autoload of the new Coffee Items
     */
    function autoAddStart(): void
    {
        loadItem();
        if ($coffeeList.length < MAX_AUTO_LOADED_ITEMS) {
            timer = setTimeout(autoAddStart, AUTO_ADD_TIMEOUT);
        }
    }

    /**
     * Autoload stop
     */
    function autoAddStop(): void
    {
        if (timer) {
            clearTimeout(timer);
        }
    }

    /**
     * Reload model with error
     */
    function reload(coffee: Coffee): void
    {
        insertAhead(coffee);
    }

    /**
     * Insert new Item and restart autoload timer
     */
    function insertAhead(coffee: Coffee | null = null): void
    {
        autoAddStop();
        loadItem(coffee);
        timer = setTimeout(autoAddStart, AUTO_ADD_TIMEOUT);
    }
</script>

<section class="coffee-list">
    <div class="listing">
        {#each $coffeeList as coffee, i (coffee.id ?? -i)}
            {#if coffee.id}
                <Item coffee={coffee}/>
            {:else}
                <ItemPlaceholder coffee={coffee} reload={reload}/>
            {/if}
        {/each}
    </div>

    <div class="actions-container">
        <button class="add-item" disabled={$isLoading} on:click={() => insertAhead()}>
                {#if $isLoading}
                    <Spinner width={30} height={30} />
                {:else}
                    <span>Load more</span>
                {/if}
        </button>
    </div>
</section>

<style lang="less">
    @import "src/styles/variables";
    @import "src/styles/mixins/breakpoints";
    @import "src/styles/mixins/grids";

    .coffee-list {

        .listing {
            .grid(1);

            .min-width(@screen-small, {
                .grid(2);
                padding: 20px;
            });

            .min-width(@screen-medium, {
                .grid(3);
            });

            .min-width(@screen-large, {
                .grid(4);
            });
        }

        .actions-container {
            text-align: center;
            margin: 20px 0;

            .add-item {
                transition-duration: @transition-fast;
                border-radius: @rounded-medium;
                background: @bg-light-blue;
                font-size: @text-base;

                border: none;
                line-height: 44px;
                height: 44px;
                cursor: pointer;
                width: 150px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto;
                transition: all;

                &:hover, :focus {
                    box-shadow: 0 0 10px 1px @bg-blue;
                }
            }
        }
    }
</style>