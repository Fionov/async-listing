<script lang="ts">
    import {Coffee} from "src/lib/interfaces/Coffee";
    import ItemReloadBlock from "src/components/coffee/ItemReloadBlock.svelte";

    export let reload: (item: Coffee) => any;
    export let coffee: Coffee;
</script>
<div class="coffee-list__item">
    <div class={`item-body state__${coffee.is_should_reload ? 'error': 'loading'}`}>
        <div class="image-block">
            <img class="image-placeholder" src="/images/coffee-placeholder.webp" alt=""/>
            <div class="item-intensifier">&nbsp;</div>
            <ItemReloadBlock reload={reload} coffee={coffee}/>
        </div>
        <div class="item-details">
            <div class="item-details__label">
                &nbsp;
            </div>
            <div class="item-details__name">
                &nbsp;
            </div>
            <div class="item-details__variety">
                &nbsp;
            </div>
            <div class="item-details__notes">
                <div class="notes-wrapper">
                    <div class="notes-list">
                        {#each {length: 3} as _, i}
                            <span class="notes-list__item">&nbsp;</span>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="less">
    @import "src/styles/coffee/listing-item";
    @import "src/styles/mixins/animations";

    .coffee-list__item {
        img.image-placeholder {
            background: @listing-item-placeholder-bg;
        }

        .item-body {
            display: flex;
            flex-direction: column;
        }

        .item-intensifier {
            background: @bg-light-gray;
            min-width: 70px;
        }

        .item-details__label {
            background: @bg-light-gray;
            width: 150px;
        }

        .item-details__name {
            width: 200px;
            background: @bg-light-gray;
        }

        .item-details__variety {
            width: 150px;
            background: @bg-light-gray;
        }

        .notes-list {
            .notes-list__item {
                width: 200px;
                background: @bg-light-gray;
            }
        }

        .item-body.state__loading {
            .animation-pulse(opacity);
        }

        .item-body.state__error {
            img.image-placeholder {
                opacity: 0;
            }
        }
    }
</style>