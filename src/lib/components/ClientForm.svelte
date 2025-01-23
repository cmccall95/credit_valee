<!-- src/lib/components/ClientForm.svelte -->
<script lang="ts">
    import type { Client } from '$lib/types';
    import { clients } from '$lib/stores';
    
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
  </script>
  
  <div class="bg-white rounded-lg shadow">
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4 text-blue-600">CLIENT FORM</h2>
      <div class="flex flex-col gap-4">
        <!-- Client Selector -->
        {#if !selectedClient}
          <div class="mb-4">
            <label class="block mb-2" for="client-select">
              <span class="text-sm font-medium">Select Client:</span>
            </label>
            <select
              id="client-select"
              bind:value={selectedClient}
              class="w-full p-2 border border-gray-200 rounded-md"
            >
              {#if $clients}
                {#each $clients as client}
                  <option value={client}>{client.name}</option>
                {/each}
              {/if}
            </select>
          </div>
        {/if}
  
        {#if selectedClient}
          <div class="grid grid-cols-2 gap-4">
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
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2" for="payment-frequency">Payment Frequency:</label>
              <input
                id="payment-frequency"
                type="text"
                bind:value={selectedClient.paymentFrequency}
                class="w-full p-2 border rounded-md"
              />
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
  
          <div class="mt-8 mb-8">
            <table class="w-full border border-gray-200">
              <thead>
                <tr>
                  <th class="p-3 border-b border-r bg-gray-50 text-left w-20">No</th>
                  <th class="p-3 border-b border-r bg-gray-50 text-left">AMOUNT $</th>
                  <th class="p-3 border-b bg-gray-50 text-left">DUE DATE</th>
                </tr>
              </thead>
              <tbody>
                {#each generatePaymentSchedule(selectedClient) as payment}
                  <tr>
                    <td class="p-3 border-b border-r">{payment.number}</td>
                    <td class="p-3 border-b border-r">{payment.amount}</td>
                    <td class="p-3 border-b">
                      {payment.date.toLocaleDateString().split('/').slice(0, 2).join('/')}
                    </td>
                  </tr>
                {/each}
                {#each Array(20 - generatePaymentSchedule(selectedClient).length) as _, index}
                  <tr>
                    <td class="p-3 border-b border-r">
                      {generatePaymentSchedule(selectedClient).length + index + 1}
                    </td>
                    <td class="p-3 border-b border-r"></td>
                    <td class="p-3 border-b"></td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
  
          <div>
            <label class="block text-sm font-medium mb-2" for="client-notes">Notes:</label>
            <textarea
              id="client-notes"
              bind:value={selectedClient.notes}
              rows={2}
              class="w-full p-2 border rounded-md"
            ></textarea>
          </div>
        {/if}
      </div>
    </div>
  </div>