<script>
import Button from './Button.svelte';
import account from '../stores/account';
import { createEventDispatcher } from 'svelte';

const emit = createEventDispatcher();

export let id;
export let topic;

function ack() {
    const { address, abi } = topic;

    $account.socket.send({
        type: 'ack',
        payload: {
            id, address, abi
        }
    });

    emit('ack', id);
}
</script>

<div>
    Mensagem {id} do tópico {topic.address}
    <Button on:click={ack}>ACK</Button>
</div>
