<!-- src/lib/components/tables/PaymentScheduleTable.svelte -->
<script lang="ts">
    import type { Payment } from '$lib/types';
    
    export let payments: Payment[];
    export let maxRows = 20;
    export let showStatus = true; // Add this prop
    
    $: emptyRowsCount = Math.max(0, maxRows - payments.length);

    // Helper function to get status color classes
    function getStatusClasses(status: string) {
        switch (status) {
            case "Paid":
                return "bg-green-100 text-green-800";
            case "Late":
                return "bg-red-100 text-red-800";
            case "Due Today":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }
</script>

<div class="border border-gray-200 rounded-lg overflow-hidden">
    <div class="max-h-96 overflow-y-auto">
        <table class="w-full">
            <thead class="sticky top-0 bg-gray-50">
                <tr>
                    <th class="p-3 border-b border-r text-left w-20">No</th>
                    <th class="p-3 border-b border-r text-left">AMOUNT $</th>
                    <th class="p-3 border-b text-left">DUE DATE</th>
                    {#if showStatus}
                        <th class="p-3 border-b border-l text-left">STATUS</th>
                    {/if}
                </tr>
            </thead>
            <tbody>
                {#each payments as payment}
                    <tr>
                        <td class="p-3 border-b border-r">{payment.number}</td>
                        <td class="p-3 border-b border-r">{payment.amount}</td>
                        <td class="p-3 border-b">
                            {payment.date.toLocaleDateString().split('/').slice(0, 2).join('/')}
                        </td>
                        {#if showStatus}
                            <td class="p-3 border-b border-l">
                                <span class={`px-2 py-1 rounded text-sm ${getStatusClasses(payment.status)}`}>
                                    {payment.status}
                                </span>
                            </td>
                        {/if}
                    </tr>
                {/each}
                {#each Array(emptyRowsCount) as _, index}
                    <tr>
                        <td class="p-3 border-b border-r">
                            {payments.length + index + 1}
                        </td>
                        <td class="p-3 border-b border-r"></td>
                        <td class="p-3 border-b"></td>
                        {#if showStatus}
                            <td class="p-3 border-b border-l"></td>
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>