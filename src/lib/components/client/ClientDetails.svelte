<!-- src/lib/components/client/ClientDetails.svelte -->
<script lang="ts">
    import type { Client } from '$lib/types';
    import { optionLists } from '$lib/stores';
    import { ChevronDown } from 'lucide-svelte';
    import { slide } from 'svelte/transition';
    
    export let selectedClient: Client;
    
    let isClientDetailsOpen = true;
    let isBundlePackageOpen = false;
    
    // Sample bundle packages (replace with actual data later)
    const bundlePackages = [
        { id: 1, name: "7 Bundle Package", price: 49.99, selected: false },
        { id: 2, name: "Premium Bundle", price: 79.99, selected: false },
        { id: 3, name: "Standard Bundle", price: 29.99, selected: false },
    ];
    
    $: frequencyOptions = $optionLists.find(list => list.id === 'paymentFrequency')?.options || [];
</script>

<div class="w-full space-y-4">
    <!-- Client Details Section -->
    <div class="border rounded-lg shadow-sm">
        <button
            class="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-colors"
            on:click={() => isClientDetailsOpen = !isClientDetailsOpen}
        >
            <h3 class="text-lg font-semibold">Client Details</h3>
            <div class={`transform transition-transform duration-200 ${isClientDetailsOpen ? 'rotate-180' : ''}`}>
                <ChevronDown class="w-5 h-5" />
            </div>
        </button>

        {#if isClientDetailsOpen}
            <div class="p-4" transition:slide>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
        {/if}
    </div>

    <!-- Bundle Package Section -->
    <div class="border rounded-lg shadow-sm">
        <button
            class="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-colors"
            on:click={() => isBundlePackageOpen = !isBundlePackageOpen}
        >
            <h3 class="text-lg font-semibold">Bundle Packages</h3>
            <div class={`transform transition-transform duration-200 ${isBundlePackageOpen ? 'rotate-180' : ''}`}>
                <ChevronDown class="w-5 h-5" />
            </div>
        </button>

        {#if isBundlePackageOpen}
            <div class="p-4" transition:slide>
                <div class="max-h-48 overflow-y-auto space-y-2">
                    {#each bundlePackages as bundle}
                        <label class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                            <input
                                type="checkbox"
                                bind:checked={bundle.selected}
                                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span class="flex-grow">{bundle.name}</span>
                            <span class="text-gray-600">${bundle.price}</span>
                        </label>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Add smooth scrollbar for bundle packages */
    .max-h-48 {
        scrollbar-width: thin;
        scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
    }
    .max-h-48::-webkit-scrollbar {
        width: 6px;
    }
    .max-h-48::-webkit-scrollbar-track {
        background: transparent;
    }
    .max-h-48::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 3px;
    }
</style>