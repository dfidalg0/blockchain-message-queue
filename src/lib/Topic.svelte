<script>
import axios from 'axios';
import Button from './Button.svelte';
import Input from './Input.svelte';
import account from '../stores/account';
import topics from '../stores/topics';

let listeners = [];
let publishers = [];
let topicPublishPending = false;

function addListener() {
    listeners = [...listeners, currentListener];
    currentListener = '';
}

function removeListener(listener) {
    listeners = listeners.filter(l => l !== listener);
}

function addPublisher() {
    publishers = [...publishers, currentPublisher];
    currentPublisher = '';
}

function removePublisher(publisher) {
    publishers = publishers.filter(l => l !== publisher);
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

        const { data: topic } = await axios.post('/api/topic', {
            publishers,
            listeners,
            addr: $account.addr,
            pswd: $account.pswd
        });

        publishers = [];
        listeners = [];

        $topics = [...$topics, topic];
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
    <h1>Adicionar Tópico</h1>

    <div>
        <Input bind:value={currentListener} />
        <Button
            on:click={addListener}
            disabled={listDisabled}
        >
            + Listener
        </Button>
    </div>

    <div>
        <Input bind:value={currentPublisher} />
        <Button
            on:click={addPublisher}
            disabled={pubDisabled}
        >
            + Publisher
        </Button>
    </div>

    <div>
        <Button on:click={onClick} {disabled}>
            {topicPublishPending ? 'Criando tópico' : 'Criar Tópico'}
        </Button>
    </div>

    <div class="lists">
        <div class="list">
            <h2>Listeners</h2>
            {#each listeners as listener }
                <p>
                    {listener}
                    <span
                        class="remove"
                        on:click={() => removeListener(listener)}
                    >
                        X
                    </span>
                </p>
            {/each}
        </div>
        <div class="list">
            <h2>Publishers</h2>
            {#each publishers as publisher}
                <p>
                    {publisher}
                    <span
                        class="remove"
                        on:click={() => removePublisher(publisher)}
                    >
                        X
                    </span>
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
    min-width: 410px;
}

.remove {
    cursor: pointer;
    font-weight: bold;
    margin-left: 4pt;
}
</style>
