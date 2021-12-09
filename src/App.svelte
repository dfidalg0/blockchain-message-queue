<script>
import { io } from 'socket.io-client';

import Topic from './lib/Topic.svelte';
import Publish from './lib/Publish.svelte';
import Footer from './lib/Footer.svelte';
import Button from './lib/Button.svelte';
import Account from './lib/Account.svelte';
import Dialog from './lib/Dialog.svelte';
import Ack from './lib/Ack.svelte';
import Message from './lib/Message.svelte';

import account from './stores/account';
import topics from './stores/topics';
import publishings from './stores/publishings';
import messages from './stores/messages';

let connecting = false;

function connect() {
    connecting = true;

    const socket = io('http://localhost:5000');
    socket.connect();

    socket.on('disconnect', () => {
        $account = null;
        connecting = true;
    });

    socket.on('loaded', ({ id, pswd }) => {
        $account = {
            addr: id,
            pswd,
            socket
        };

        connecting = false;
    });

    socket.on('message', msg => {
        switch (msg.type) {
            case 'topic': {
                $topics = [...$topics, msg.payload];
                break;
            }
            case 'publish': {
                $publishings = [...$publishings, msg.payload];
                break;
            }
            case 'message': {
                $messages = [...$messages, msg.payload];
            }
        }
    });
}

let showTopicDialog = false;
let showMessageDialog = false;
</script>

<main>
    <h1>Fila de Mensagens</h1>

    {#if connecting}
        <div>
            Conectando...
        </div>
    {/if}

    {#if $account}
        <Dialog bind:show={showTopicDialog}>
            <Topic />
        </Dialog>

        <Dialog bind:show={showMessageDialog}>
            <Publish />
        </Dialog>

        <Button on:click={() => showTopicDialog = true}>
            Criar tópico
        </Button>

        <Button on:click={() => showMessageDialog = true}>
            Publicar mensagem
        </Button>

        <Account addr={$account.addr} />
    {:else}
        <Button on:click={connect} disabled={connecting}>
            Conectar
        </Button>
    {/if}

    {#each $publishings as { id, topic }, index (index)}
        <div class="ack" style="--distance: {index * 55}pt">
            <Ack {id} {topic}
                on:ack={e => $publishings = $publishings.filter(
                    p => p.id !== e.detail
                )}
            />
        </div>
    {/each}

    <div class="messages">
        {#if $messages.length}
            <h2>Mensagens recebidas</h2>
        {:else if $account}
            <h3>Nenhuma mensagem recebida</h3>
        {/if}

        {#each $messages as { id, text, topic: { address } }, index (index)}
            <Message {id} {text} {address} />
        {/each}
    </div>

    <Footer />
</main>

<style>
main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10pt;
}

h1 {
    color: #1bb15a;
    text-transform: uppercase;
    font-size: 3rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
}

@media (min-width: 480px) {
    h1 {
        max-width: none;
    }
}

.ack {
    position: fixed;
    z-index: 10;
    background: white;
    right: 2rem;
    top: calc(2rem + var(--distance, 0px));
    font-size: 11pt;
    width: 300pt;
    padding: .5em;
    box-shadow: 5px 2px 10px 0px rgba(0, 0, 0, 0.308);
}

.messages {
    width: 70vw;
    overflow: auto;
}
</style>
