<script>
import { io } from 'socket.io-client';

import Topic from './lib/Topic.svelte';
import Footer from './lib/Footer.svelte';
import Button from './lib/Button.svelte';
import Account from './lib/Account.svelte';
import account from './stores/account';

let connecting = false;
let socket;

function connect() {
    connecting = true;

    socket = io('http://localhost:5000');
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
}
</script>

<main>
    <h1>Fila de Mensagens</h1>

    {#if connecting}
        <div>
            Conectando...
        </div>
    {/if}

    {#if $account}
        <Topic />

        <Account addr={$account.addr} />
    {:else}
        <Button on:click={connect} disabled={connecting}>
            Conectar
        </Button>
    {/if}

    <Footer />
</main>

<style>
main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
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
</style>
