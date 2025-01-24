<!-- src/lib/components/client/ClientSelector.svelte -->
<script lang="ts">
    import type { Client } from '$lib/types';
    import CustomSelect from '$lib/components/ui/CustomSelect.svelte';
    
    export let clients: Client[] = [];
    export let selectedClient: Client | null;
    export let onNewClient: () => void;

    function handleSelect(event: CustomEvent) {
        selectedClient = event.detail;
    }
</script>

<CustomSelect
    items={clients}
    bind:value={selectedClient}
    placeholder="Select a client"
    showNewOption={true}
    on:select={handleSelect}
    on:new={onNewClient}
/>