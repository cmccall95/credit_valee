<!-- src/lib/components/client/NewClientForm.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Modal from '$lib/components/ui/Modal.svelte';
    import { ChevronDown, ChevronUp, X } from 'lucide-svelte';
  
    export let isOpen = false;
  
    const dispatch = createEventDispatcher();
  
    let formData = {
        name: '',
        email: '',
        phone: '',
        startDate: '',
        numberOfPayments: '',
        paymentAmount: '',
        notes: ''
    };
    
    let deposits: number[] = [];
    let depositInput = '';
    let sections = {
        clientInfo: true,
        planDetails: true,
        depositDetails: true,
        notes: true
    };
 
    function handleClose() {
        isOpen = false;
        dispatch('close');
    }
 
    function handleSubmit(e: Event) {
        e.preventDefault();
        const submitData = {
            ...formData,
            deposits,
            totalDepositAmount: calculateDepositTotal(),
            totalPlanAmount: calculateTotal()
        };
        console.log('Submitting:', submitData);
        handleClose();
    }
 
    function handleDepositKeyDown(e: KeyboardEvent) {
        if ((e.key === 'Enter' || e.key === 'Tab') && depositInput && !isNaN(parseFloat(depositInput))) {
            e.preventDefault();
            deposits = [...deposits, parseFloat(depositInput)];
            depositInput = '';
        }
    }
 
    function handleDeleteDeposit(index: number) {
        deposits = deposits.filter((_, i) => i !== index);
    }
 
    function toggleSection(section: keyof typeof sections) {
        sections[section] = !sections[section];
    }
 
    function calculateDepositTotal(): number {
        return deposits.reduce((sum, amount) => sum + amount, 0);
    }
 
    function calculateTotal(): number {
        const payments = parseFloat(formData.numberOfPayments) || 0;
        const paymentAmount = parseFloat(formData.paymentAmount) || 0;
        return calculateDepositTotal() + (payments * paymentAmount);
    }
 </script>
 
 <Modal {isOpen} title="New Client" on:close={handleClose}>
    <form on:submit={handleSubmit} class="space-y-6">
        <!-- Total Amount -->
        <div class="bg-white-100 p-4 rounded-lg shadow">
            <div class="text-right">
                <span class="text-sm text-gray-500">Total Plan Amount</span>
                <div class="text-3xl font-bold text-green-600">
                    ${calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
            </div>
        </div>
 
        <!-- Client Info -->
        <div class="bg-white-100 p-4 rounded-lg shadow">
            <button 
                type="button"
                class="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-md"
                on:click={() => toggleSection('clientInfo')}
            >
                <h3 class="text-lg font-semibold">Client Information</h3>
                <svelte:component this={sections.clientInfo ? ChevronUp : ChevronDown} class="w-5 h-5" />
            </button>
            
            {#if sections.clientInfo}
                <div class="p-4 border-t">
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label for="name" class="block text-sm font-medium mb-1">Name *</label>
                            <input
                                type="text"
                                id="name"
                                bind:value={formData.name}
                                required
                                class="w-full p-2 border rounded-md bg-white"
                            />
                        </div>
                        <div>
                            <label for="email" class="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                bind:value={formData.email}
                                class="w-full p-2 border rounded-md bg-white"
                            />
                        </div>
                        <div>
                            <label for="phone" class="block text-sm font-medium mb-1">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                bind:value={formData.phone}
                                class="w-full p-2 border rounded-md bg-white"
                            />
                        </div>
                    </div>
                </div>
            {/if}
        </div>
 
        <!-- Plan Details -->
        <div class="bg-white-100 p-4 rounded-lg shadow">
            <button 
                type="button"
                class="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-md"
                on:click={() => toggleSection('planDetails')}
            >
                <h3 class="text-lg font-semibold">Plan Details</h3>
                <svelte:component this={sections.planDetails ? ChevronUp : ChevronDown} class="w-5 h-5" />
            </button>
            
            {#if sections.planDetails}
                <div class="p-4 border-t">
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label for="startDate" class="block text-sm font-medium mb-1">Start Date *</label>
                            <input
                                type="date"
                                id="startDate"
                                bind:value={formData.startDate}
                                required
                                class="w-full p-2 border rounded-md bg-white"
                            />
                        </div>
                        <div>
                            <label for="numberOfPayments" class="block text-sm font-medium mb-1">Number of Payments *</label>
                            <input
                                type="number"
                                id="numberOfPayments"
                                bind:value={formData.numberOfPayments}
                                required
                                min="1"
                                class="w-full p-2 border rounded-md bg-white"
                            />
                        </div>
                        <div>
                            <label for="paymentAmount" class="block text-sm font-medium mb-1">Payment Amount *</label>
                            <input
                                type="number"
                                id="paymentAmount"
                                bind:value={formData.paymentAmount}
                                required
                                min="0"
                                step="0.01"
                                class="w-full p-2 border rounded-md bg-white"
                            />
                        </div>
                    </div>
                </div>
            {/if}
        </div>
        
        <!-- Deposit Details section -->
        <div class="bg-white-100 p-4 rounded-lg shadow">
            <button 
                type="button"
                class="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-md"
                on:click={() => toggleSection('depositDetails')}
            >
                <h3 class="text-lg font-semibold">Deposit Details</h3>
                <svelte:component this={sections.depositDetails ? ChevronUp : ChevronDown} class="w-5 h-5" />
            </button>
            
            {#if sections.depositDetails}
                <div class="p-4 border-t space-y-4">
                    <div>
                        <label for="depositAmount" class="block text-sm font-medium mb-1">Deposit Amount</label>
                        <input
                            type="text"
                            id="depositAmount"
                            value="${calculateDepositTotal().toFixed(2)}"
                            readonly
                            class="w-full p-2 border rounded-md bg-white text-gray-700"
                        />
                    </div>
                    <div>
                        <label for="depositPlan" class="block text-sm font-medium mb-1">Deposit Plan (Press Enter/Tab to add)</label>
                        <div class="space-y-2">
                            <input
                                type="number"
                                id="depositPlan"
                                min="0"
                                step="0.01"
                                bind:value={depositInput}
                                on:keydown={handleDepositKeyDown}
                                class="w-full p-2 border rounded-md bg-white"
                                placeholder="Enter deposit amount"
                            />
                            <div class="flex flex-wrap gap-2 min-h-[42px] p-2 border rounded-md bg-white">
                                {#each deposits as amount, index}
                                    <span class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        ${amount.toFixed(2)}
                                        <button
                                            type="button"
                                            on:click={() => handleDeleteDeposit(index)} 
                                            class="hover:text-blue-600"
                                        >
                                            <X class="w-4 h-4" />
                                        </button>
                                    </span>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Notes section -->
        <div class="bg-white-100 p-4 rounded-lg shadow">
            <button 
                type="button"
                class="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-md"
                on:click={() => toggleSection('notes')}
            >
                <h3 class="text-lg font-semibold">Additional Information</h3>
                <svelte:component this={sections.notes ? ChevronUp : ChevronDown} class="w-5 h-5" />
            </button>
            
            {#if sections.notes}
                <div class="p-4 border-t">
                    <div>
                        <label for="notes" class="block text-sm font-medium mb-1">Notes</label>
                        <textarea
                            id="notes"
                            bind:value={formData.notes}
                            rows="3"
                            class="w-full p-2 border rounded-md bg-white"
                        ></textarea>
                    </div>
                </div>
            {/if}
        </div>
        
        <!-- Form Actions -->
        <div class="flex justify-end gap-2">
            <button
                type="button"
                class="px-4 py-2 text-sm text-gray-600 bg-white hover:bg-gray-50 rounded-md shadow"
                on:click={handleClose}
            >
                Cancel
            </button>
            <button
                type="submit"
                class="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow"
            >
                Create Client
            </button>
        </div>
    </form>
 </Modal>