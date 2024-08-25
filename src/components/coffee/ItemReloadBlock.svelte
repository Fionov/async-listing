<script lang="ts">
    import {Coffee} from "src/lib/interfaces/Coffee";

    export let reload: (item: Coffee) => any;
    export let coffee: Coffee;
</script>

{#if coffee.is_should_reload}
    <div class="reload-block">
        <button on:click={reload(coffee)}>
                <span class="loading-error">
                  Network error.<br/>Click here to try again.<br/>
                  <span class="reload-icon"></span>
                </span>
        </button>
    </div>
{/if}

<style lang="less">
    @import "src/styles/variables";
    @import "src/styles/icons";

    .loading-error {
        font-size: @text-medium;
        font-weight: @font-light;
        color: @text-light-gray;

        display: block;
        padding-top: 30px;

        &:hover {
            .reload-icon {
                transform: rotate(180deg);
            }
        }
    }

    .reload-icon {
        color: @text-dark-gray;
        background: @bg-gray;
        -webkit-mask: @reload-icon;
        mask: @reload-icon;

        background-size: contain;
        display: inline-block;
        margin-top: 10px;
        width: 50px;
        height: 50px;
        transition: transform;
        transition-duration: @transition-fast;
    }

    .reload-block {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 1;

        button {
            all: unset;
            cursor: pointer;
            width: 100%;
            height: 100%;
            display: block;
            text-align: center;
        }
    }
</style>