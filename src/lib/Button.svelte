<button on:click {...$$restProps}>
    <slot />
</button>

<style>
button {
    font-family: inherit;
    font-size: inherit;
    padding: .4em .4em;
    color: #52ad75;
    background-color: rgba(0, 255, 149, 0.1);
    border-radius: 2em;
    border: none;
    outline: none;
    width: 200px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
}

button:disabled {
    color: #91e2b0;
    background-color: rgba(0, 255, 149, 0.07);
    cursor: not-allowed;
}

button:focus {
    border: 2px solid #37bd73;
}

button:active {
    background-color: rgba(0, 255, 157, 0.2);
}
</style>
