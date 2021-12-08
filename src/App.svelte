<script>
import logo from './assets/svelte.png';
import Counter from './lib/Counter.svelte';
</script>

<main>
    <!-- <img src={logo} alt="Svelte Logo" /> -->
    <h1>Fila de Mensagens</h1>

    <Counter />

    <!-- <p>
        Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte
        apps.
    </p> -->

    <p>
        Repositório do trabalho disponível em:
         <a href="https://github.com/diegood12/blockchain-message-queue">github</a>
    </p>
</main>

<style>
:root {
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
}

img {
    height: 16rem;
    width: 16rem;
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

p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
}

@media (min-width: 480px) {
    h1 {
        max-width: none;
    }

    p {
        max-width: none;
    }
}
</style>
