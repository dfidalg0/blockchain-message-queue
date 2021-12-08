<script>
import axios from 'axios';
import Button from './Button.svelte';
import Input from './Input.svelte';

let listeners = [];
let publishers = [];
let pending = false;

function addListener() {
    listeners = [...listeners, currentListener];
    currentListener = '';
}

function addPublisher() {
    publishers = [...publishers, currentPublisher];
    currentPublisher = '';
}

let currentListener = '';
let currentPublisher = '';

$: disabled = !listeners.length || !publishers.length || pending;

function isValidEthAddr(str) {
    return Boolean(str.match(/^0x[a-fA-F0-9]{40}/));
}

async function onClick() {
    try{
        pending = true;

        const { data: contract } = await axios.post('/api/topic', {
            publishers,
            listeners,
        });

        console.log(contract);
        console.log(publishers);
        console.log(listeners);
    }
    catch(err){
        alert('Entrada inválida');
    }
    finally {
        pending = false;
    }
}
</script>

<div class="container">
    <div>
        <Input bind:value={currentListener} />
        <Button
            on:click={addListener}
            disabled={!isValidEthAddr(currentListener)}
        >
            Add Listener
        </Button>
    </div>

    <div>
        <Input bind:value={currentPublisher} />
        <Button
            on:click={addPublisher}
            disabled={!isValidEthAddr(currentPublisher)}
        >
            Add Publisher
        </Button>
    </div>

    <div>
        <Button on:click={onClick} {disabled}>
            Criar Tópico
        </Button>
    </div>
</div>


{#each listeners as listener }
<h1>
    {listener}
</h1>
{/each}

<style>
.container {
    display: flex;
    flex-direction: column;
    gap: 5pt;
}
</style>
