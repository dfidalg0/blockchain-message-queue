<script>
import Input from './Input.svelte';
import Button from './Button.svelte';

import topics from '../stores/topics';
import account from '../stores/account';

function send(abi, address, payload) {
    $account.socket.send({
        type: 'message',
        abi,
        address,
        payload,
    });

    inputs[address] = '';
}

let inputs = {};
</script>

<div class="container">
    <h1>
        Publicar Mensagem
    </h1>

    {#if !$topics.length}
        Nenhum tópico publicável
    {/if}

    {#each $topics as { abi, address }}
        <div class="topic">
            <div class="title">
                {address}
            </div>
            <div class="send-box">
                <Input bind:value={inputs[address]} />
                <Button on:click={() => send(abi, address, inputs[address])}>
                    Enviar
                </Button>
            </div>
        </div>
    {/each}
</div>

<style>
.container {
    display: flex;
    flex-direction: column;
    gap: 3pt;
}
</style>
