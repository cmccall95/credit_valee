<!-- src/lib/components/client/ClientDetails.svelte -->
<script lang="ts">
    import type { Client } from '$lib/types';
    import { optionLists } from '$lib/stores';
    
    export let selectedClient: Client;
    
    $: frequencyOptions = $optionLists.find(list => list.id === 'paymentFrequency')?.options || [];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div>
        <label class="block text-sm font-medium mb-2" for="client-name">Name:</label>
        <input
            id="client-name"
            type="text"
            bind:value={selectedClient.name}
            class="w-full p-2 border rounded-md"
        />
    </div>
    <div>
        <label class="block text-sm font-medium mb-2" for="client-phone">Phone #:</label>
        <input
            id="client-phone"
            type="text"
            bind:value={selectedClient.phoneNumber}
            class="w-full p-2 border rounded-md"
        />
    </div>
    <div>
        <label class="block text-sm font-medium mb-2" for="payment-frequency">Payment Frequency:</label>
        <select
            id="payment-frequency"
            bind:value={selectedClient.paymentFrequency}
            class="w-full p-2 border rounded-md"
        >
            {#each frequencyOptions as frequency}
                <option value={frequency}>{frequency}</option>
            {/each}
        </select>
    </div>
    <div>
        <label class="block text-sm font-medium mb-2" for="deposit-paid">Deposit Paid:</label>
        <input
            id="deposit-paid"
            type="number"
            step="0.01"
            bind:value={selectedClient.depositPaid}
            class="w-full p-2 border rounded-md"
        />
    </div>
</div>