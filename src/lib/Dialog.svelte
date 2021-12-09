<script>
import { fade } from 'svelte/transition';

export let show = false;
export let width = '70vw';
export let height = '70vh';
</script>

{#if show}
    <div
        class="container"
        transition:fade={{ duration: 200 }}
        style="--width: {width}; --height: {height};"
    >
        <div class="inner">
            <slot />
        </div>
        <span on:click={() => show = false} class="close">
            X
        </span>
    </div>
{/if}

<style>
.container {
    position: relative;
    background: white;
    z-index: 5;
    position: fixed;
    inset: 0;
    margin: auto;
    width: var(--width);
    height: var(--height);
    box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.308);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem 1rem;
    overflow: auto;
}

.inner {
    max-width: 100%;
    max-height: 100%;
}

.close {
    font-size: 1.3rem;
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
    cursor: pointer;
}
</style>
