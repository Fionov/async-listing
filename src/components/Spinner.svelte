<script lang="ts">
    export let width: number;
    export let height: number;
</script>

<div class="spinner" style={`width: ${width}px; height: ${height}px;`}></div>

<style lang="less">
    @import "src/styles/mixins/animations";
    @import "src/styles/variables";

    .rotation();
    .spinner {
        border: 3px solid @bg-white;
        border-bottom-color: @bg-blue;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }
</style>