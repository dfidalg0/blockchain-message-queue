<script>
import Topic from './lib/Topic.svelte';
import Footer from './lib/Footer.svelte';
</script>

<main>
    <h1>Fila de Mensagens</h1>

    <Topic />

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
