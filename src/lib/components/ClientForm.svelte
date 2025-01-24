<!-- src/lib/components/ClientForm.svelte -->
<script lang="ts">
    import type { Client } from '$lib/types';
    import { clients } from '$lib/stores';
    import ClientSelector from '$lib/components/client/ClientSelector.svelte';
    import ClientDetails from '$lib/components/client/ClientDetails.svelte';
    import PaymentScheduleTable from '$lib/components/tables/PaymentScheduleTable.svelte';
    import ClientNotes from '$lib/components/client/ClientNotes.svelte';
    import NewClientForm from '$lib/components/client/NewClientForm.svelte';
    
    let showNewClientForm = false;

    
    export let selectedClient: Client | null = null;
    
    function generatePaymentSchedule(client: Client) {
        if (!client) return [];
        
        const schedule = [];
        let currentDate = new Date(client.startDate);
        const today = new Date();

        schedule.push({
            number: 1,
            date: new Date(currentDate),
            amount: client.firstPayment,
            status: "Paid",
            dueIn: null,
            clientId: client.id,
            clientName: client.name,
        });

        for (let i = 2; i <= client.numberOfPayments; i++) {
            currentDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
            const dueInDays = Math.ceil(
                (new Date(currentDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );
            const status = dueInDays < 0 ? "Late" : dueInDays === 0 ? "Due Today" : "Pending";

            schedule.push({
                number: i,
                date: new Date(currentDate),
                amount: client.regularPayment,
                status,
                dueIn: dueInDays,
                clientId: client.id,
                clientName: client.name,
            });
        }
        return schedule;
    }

    function handleNewClient() {
        selectedClient = null;
        // Additional new client logic can be added here
        showNewClientForm = true;
    }

    $: paymentSchedule = selectedClient ? generatePaymentSchedule(selectedClient) : [];
</script>

<div class="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
    <h2 class="text-xl md:text-2xl font-bold text-blue-600 mb-6">CLIENT FORM</h2>
    
    <div class="flex flex-col md:flex-row gap-6">
        <!-- Left Side - Client Selector -->
        <div class="md:w-64 flex-shrink-0">
            <ClientSelector 
                clients={$clients}
                bind:selectedClient
                onNewClient={handleNewClient}
            />
        </div>

        <!-- Right Side - Form Content -->
        <div class="flex-grow">
            {#if selectedClient}
                <ClientDetails {selectedClient} />
                <div class="mb-6">
                    <PaymentScheduleTable payments={paymentSchedule} />
                </div>
                <ClientNotes {selectedClient} />
            {/if}
        </div>
    </div>
</div>
<NewClientForm 
    bind:isOpen={showNewClientForm} 
    on:close={() => showNewClientForm = false}
/>