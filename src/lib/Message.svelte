<script>
import Input from './Input.svelte';
import Button from './Button.svelte';

import topics from '../stores/topics';
</script>

<div class="container">
    <h1>
        Publicar Mensagem
    </h1>

    {#if !$topics.length}
        Nenhum tópico publicável
    {/if}

    {#each $topics as topic}
        <div class="topic">
            <div class="title">
                {topic.address}
            </div>
            <div class="send-box">
                <Input />
                <Button>
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
