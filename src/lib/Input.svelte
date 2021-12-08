<script>
export let value = '';
</script>

<input bind:value />

<style>
input {
    color: #52ad75;
    padding: .4em .7em;
    border: 2px dashed rgba(0, 255, 149, .5);
    border-radius: 2em;
}

input:focus {
    outline: none;
    border: 2px solid #37bd73;
}
</style>
