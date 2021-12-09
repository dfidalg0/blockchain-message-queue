<script>
import axios from 'axios';
import Button from './Button.svelte';
import Input from './Input.svelte';
import account from '../stores/account';

let listeners = [];
let publishers = [];
let topicPublishPending = false;

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

$: disabled = !listeners.length || topicPublishPending;
$: pubDisabled = (
    !isValidEthAddr(currentPublisher) ||
    publishers.includes(currentPublisher)
);
$: listDisabled = (
    !isValidEthAddr(currentListener) ||
    listeners.includes(currentListener)
);

function isValidEthAddr(str) {
    return Boolean(str.match(/^0x[a-fA-F0-9]{40}/));
}

async function onClick() {
    try{
        topicPublishPending = true;

        const { data: contract } = await axios.post('/api/topic', {
            publishers,
            listeners,
            addr: $account.addr,
        });

        console.log(contract);

        publishers = [];
        listeners = [];
    }
    catch(err){
        if (err.response) {
            alert(err.response.data.message);
        }
        else {
            alert('Um erro inesperado ocorreu');
        }
    }
    finally {
        topicPublishPending = false;
    }
}
</script>

<div class="container">
    <div>
        <Input bind:value={currentListener} />
        <Button
            on:click={addListener}
            disabled={listDisabled}
        >
            Add Listener
        </Button>
    </div>

    <div>
        <Input bind:value={currentPublisher} />
        <Button
            on:click={addPublisher}
            disabled={pubDisabled}
        >
            Add Publisher
        </Button>
    </div>

    <div>
        <Button on:click={onClick} {disabled}>
            Criar Tópico
        </Button>
    </div>

    <div class="lists">
        <div class="list">
            <h2>Listeners</h2>
            {#each listeners as listener }
                <p>
                    {listener}
                </p>
            {/each}
        </div>
        <div class="list">
            <h2>Publishers</h2>
            {#each publishers as publisher}
                <p>
                    {publisher}
                </p>
            {/each}
        </div>
    </div>
</div>

<style>
.container {
    display: flex;
    flex-direction: column;
    gap: 5pt;
}

.lists {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
}

.list {
    text-align: center;
    flex-basis: 50%;
    min-width: 300pt;
}
</style>
