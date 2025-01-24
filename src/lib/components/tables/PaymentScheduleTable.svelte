<!-- src/lib/components/tables/PaymentScheduleTable.svelte -->
<script lang="ts">
    import type { Payment } from '$lib/types';
    
    export let payments: Payment[];
    export let maxRows = 20;
    
    $: emptyRowsCount = Math.max(0, maxRows - payments.length);
</script>

<div class="border border-gray-200 rounded-lg overflow-hidden">
    <div class="max-h-96 overflow-y-auto">
        <table class="w-full">
            <thead class="sticky top-0 bg-gray-50">
                <tr>
                    <th class="p-3 border-b border-r text-left w-20">No</th>
                    <th class="p-3 border-b border-r text-left">AMOUNT $</th>
                    <th class="p-3 border-b text-left">DUE DATE</th>
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
                    </tr>
                {/each}
                {#each Array(emptyRowsCount) as _, index}
                    <tr>
                        <td class="p-3 border-b border-r">
                            {payments.length + index + 1}
                        </td>
                        <td class="p-3 border-b border-r"></td>
                        <td class="p-3 border-b"></td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>