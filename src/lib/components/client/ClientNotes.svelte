<!-- src/lib/components/client/ClientNotes.svelte -->
<script lang="ts">
    import type { Client } from '$lib/types';
    
    export let selectedClient: Client;
</script>

<div>
    <label class="block text-sm font-medium mb-2" for="client-notes">Notes:</label>
    <textarea
        id="client-notes"
        bind:value={selectedClient.notes}
        rows={2}
        class="w-full p-2 border rounded-md"
    ></textarea>
</div>