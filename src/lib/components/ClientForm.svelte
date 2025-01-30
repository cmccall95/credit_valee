<!-- src/lib/components/ClientForm.svelte -->
<script lang="ts">
    import type { Client } from '$lib/types';
    import { clients } from '$lib/stores';
    import ClientSelector from '$lib/components/client/ClientSelector.svelte';
    import ClientDetails from '$lib/components/client/ClientDetails.svelte';
    import PaymentScheduleTable from '$lib/components/tables/PaymentScheduleTable.svelte';
    import ClientNotes from '$lib/components/client/ClientNotes.svelte';
    import NewClientForm from '$lib/components/client/NewClientForm.svelte';
    import { Printer, DollarSign, Gift, UserCog } from 'lucide-svelte';
    
    let showNewClientForm = false;

    let showPaymentStatus = true;
    let showBundleEditor = false;
    let showClientEditor = false;

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
        showNewClientForm = true;
    }

    $: paymentSchedule = selectedClient ? generatePaymentSchedule(selectedClient) : [];
</script>

<!-- In ClientForm.svelte -->
<div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-6">
        <div class="bg-white rounded-lg shadow">

            <!-- Toolbar -->
            <div class="p-4 pb-2">
                <div class="flex items-center gap-2 p-1.5 rounded-md">
                    <button 
                        class="flex items-center p-2 rounded-md hover:bg-amber-50 transition-colors"
                        title="Print"
                        on:click={() => { /* Add print functionality */ }}
                    >
                        <Printer class="w-4 h-4 text-gray-600 hover:text-amber-600" />
                    </button>
                    
                    <div class="h-4 w-px bg-gray-200"></div>
                    
                    <button 
                        class="flex items-center p-2 rounded-md hover:bg-amber-50 transition-colors"
                        title={showPaymentStatus ? 'Hide Payment Status' : 'Show Payment Status'}
                        on:click={() => showPaymentStatus = !showPaymentStatus}
                    >
                        <DollarSign class="w-4 h-4 text-green-500" />
                    </button>
                    
                    <button 
                        class="flex items-center p-2 rounded-md hover:bg-amber-50 transition-colors"
                        title="Edit Bundle Packages"
                        on:click={() => showBundleEditor = !showBundleEditor}
                    >
                        <Gift class="w-4 h-4 text-purple-500" />
                    </button>
                    
                    <button 
                        class="flex items-center p-2 rounded-md hover:bg-amber-50 transition-colors"
                        title="Edit Client Details"
                        on:click={() => showClientEditor = !showClientEditor}
                    >
                        <UserCog class="w-4 h-4 text-blue-500" />
                    </button>
                </div>
            </div>

            <!-- Header Section -->
            <div class="p-4 border-b">
                <h2 class="text-xl md:text-2xl font-bold text-blue-600">CLIENT FORM</h2>
            </div>
            
            <!-- Main Content Area -->
            <!-- Client Selector Section -->
            <div class="p-4">
                <!-- Client Selector Section - removed fixed width -->
                <div class="mb-6">
                    <ClientSelector 
                        clients={$clients}
                        bind:selectedClient
                        onNewClient={handleNewClient}
                    />
                </div>


                <!-- Client Form Content -->
                {#if selectedClient}
                    <div class="space-y-6">
                        <div class="w-full">
                            <ClientDetails {selectedClient} />
                        </div>

                        <div class="w-full overflow-x-auto">
                            <PaymentScheduleTable
                                payments={paymentSchedule} 
                                showStatus={showPaymentStatus}
                             />
                        </div>

                        <!-- Notes Section - removed max width constraint -->
                        <div class="w-full">
                            <ClientNotes {selectedClient} />
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<NewClientForm 
    bind:isOpen={showNewClientForm} 
    on:close={() => showNewClientForm = false}
/>