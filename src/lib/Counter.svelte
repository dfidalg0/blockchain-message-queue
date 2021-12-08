<script>
import axios from 'axios';

let count = 0;
let listeners = [];
let publishers = [];
    
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


const debounce = (fn, time) => {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => fn(...args), time);
    };
};


const onClick = debounce(async () => {
    try{
        const { data: contract } = await axios.post('/api/topic', {
            publishers,
            listeners,
        });

        console.log(contract);
        console.log(publishers);
        console.log(listeners);
        alert('Contract compiled:\n\n' + JSON.stringify(contract, null, 4));

        count++;
    }
    catch(err){
        alert('Entrada inválida');
    }
}, 500);
</script>

<input bind:value={currentListener} />
<button on:click={addListener}>Add Listener</button>

<br>

<input bind:value={currentPublisher} />
<button on:click={addPublisher}>Add Publisher</button>

<br>

<button on:click={onClick}>
    Compilar Contrato: {count}
</button>

{#each listeners as listener }
<h1>
    {listener}
</h1>   
{/each}


<style>
button {
    font-family: inherit;
    font-size: inherit;
    padding: 1em 2em;
    color: #52ad75;
    background-color: rgba(0, 255, 149, 0.1);
    border-radius: 2em;
    border: 2px solid rgba(0, 255, 149, 0);
    outline: none;
    width: 200px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
}

button:focus {
    border: 2px solid #37bd73;
}

button:active {
    background-color: rgba(0, 255, 157, 0.2);
}
</style>
