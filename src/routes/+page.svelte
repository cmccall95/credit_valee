<script lang="ts">
  import { onMount } from 'svelte';
  import { clients } from '$lib/stores';
  import type { Client, Payment } from '$lib/types';

  let activeTab = "reports";
  let selectedClient: Client | null = null;
  let dateRange = {
    start: new Date().toISOString().split("T")[0],
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  };
  let statusFilter = "All";
  let today = new Date();

  // Initialize selectedClient after the component mounts
  onMount(() => {
    const unsubscribe = clients.subscribe(value => {
      if (value && value.length > 0) {
        selectedClient = value[0];
      }
    });

    return () => {
      unsubscribe();
    };
  });

  function generatePaymentSchedule(client: Client): Payment[] {
    if (!client) return [];
    
    const schedule: Payment[] = [];
    let currentDate = new Date(client.startDate);

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

  function getFilteredPayments() {
    if (!selectedClient) return [];
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    // Get all payments from all clients
    return $clients.flatMap(client => generatePaymentSchedule(client)).filter(payment => {
        const paymentDate = new Date(payment.date);
        const dateInRange = paymentDate >= startDate && paymentDate <= endDate;
        const statusMatches = statusFilter === "All" || payment.status === statusFilter;
        return dateInRange && statusMatches;
    });
    }
</script>

<div class="max-w-4xl mx-auto p-4">
  <!-- Client Selector -->
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

  <!-- Tab Navigation -->
  <div class="grid grid-cols-3 gap-2 mb-4">
    {#each ['reports', 'schedule', 'form'] as tab}
      <button
        on:click={() => activeTab = tab}
        class="p-2 text-center rounded-t-md {activeTab === tab ? 'bg-white border-b-2 border-blue-500 font-medium' : 'bg-gray-100'}"
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    {/each}
  </div>

  <!-- Reports View -->
    {#if activeTab === 'reports'}
    <div class="bg-white rounded-lg shadow">
        <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Payment Reports</h2>
        <!-- Filters -->
        <div class="grid grid-cols-3 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
            
            <div>
                <label class="block text-sm font-medium mb-2" for="start-date">Start Date:</label>
                <input
                    id="start-date"
                    type="date"
                    bind:value={dateRange.start}
                    class="w-full p-2 border rounded-md"
                />
                </div>
                <div>
                <label class="block text-sm font-medium mb-2" for="end-date">End Date:</label>
                <input
                    id="end-date"
                    type="date"
                    bind:value={dateRange.end}
                    class="w-full p-2 border rounded-md"
                />
                </div>
                <div>
                <label class="block text-sm font-medium mb-2" for="status-filter">Status:</label>
                <select
                    id="status-filter"
                    bind:value={statusFilter}
                    class="w-full p-2 border rounded-md"
                >
                    <option value="All">All Statuses</option>
                    <option value="Late">Late</option>
                    <option value="Due Today">Due Today</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                </select>
                </div>
        </div>

        <!-- Add this Payments Table -->
        <div class="overflow-x-auto">
            <table class="w-full">
            <thead>
                <tr>
                <th class="text-left p-2 bg-gray-50">Client Name</th>
                <th class="text-left p-2 bg-gray-50">Payment #</th>
                <th class="text-left p-2 bg-gray-50">Due Date</th>
                <th class="text-left p-2 bg-gray-50">Amount</th>
                <th class="text-left p-2 bg-gray-50">Status</th>
                </tr>
            </thead>
            <tbody>
                {#each getFilteredPayments() as payment}
                <tr class={payment.status === "Late" ? "bg-red-50" : payment.status === "Due Today" ? "bg-yellow-50" : ""}>
                    <td class="p-2">{payment.clientName}</td>
                    <td class="p-2">{payment.number}</td>
                    <td class="p-2">{payment.date.toLocaleDateString()}</td>
                    <td class="p-2">${payment.amount}</td>
                    <td class="p-2">
                    <span class={`px-2 py-1 rounded text-sm ${
                        payment.status === "Paid" ? "bg-green-100 text-green-800" :
                        payment.status === "Late" ? "bg-red-100 text-red-800" :
                        payment.status === "Due Today" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                    }`}>
                        {payment.status}
                    </span>
                    </td>
                </tr>
                {/each}
            </tbody>
            </table>
        </div>
        </div>
    </div>
    {/if}

  <!-- Schedule View -->
  {#if activeTab === 'schedule' && selectedClient}
    <div class="bg-white rounded-lg shadow">
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Payment Schedule</h2>
          <p class="text-sm">
            Total Contract: ${generatePaymentSchedule(selectedClient).reduce((sum, payment) => sum + payment.amount, 0)}
          </p>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <p class="text-sm font-medium">Client: {selectedClient.name}</p>
            <p class="text-sm">Payment Frequency: {selectedClient.paymentFrequency}</p>
            <p class="text-sm">Deposit Paid: ${selectedClient.depositPaid}</p>
          </div>
          <div>
            {#if generatePaymentSchedule(selectedClient).filter(payment => payment.status === "Late").length > 0}
              <p class="text-sm font-medium text-red-600">
                Past Due: {generatePaymentSchedule(selectedClient).filter(payment => payment.status === "Late").length}
              </p>
              <p class="text-sm text-red-600">
                Amount: ${generatePaymentSchedule(selectedClient)
                  .filter(payment => payment.status === "Late")
                  .reduce((sum, payment) => sum + payment.amount, 0)}
              </p>
            {/if}
          </div>
        </div>
        <table class="w-full">
          <thead>
            <tr>
              <th class="text-left p-2 bg-gray-50">No</th>
              <th class="text-left p-2 bg-gray-50">Due Date</th>
              <th class="text-left p-2 bg-gray-50">Amount</th>
              <th class="text-left p-2 bg-gray-50">Status</th>
            </tr>
          </thead>
          <tbody>
            {#each generatePaymentSchedule(selectedClient) as payment}
              <tr class={payment.status === "Late" ? "bg-red-50" : payment.status === "Due Today" ? "bg-yellow-50" : ""}>
                <td class="p-2">{payment.number}</td>
                <td class="p-2">{payment.date.toLocaleDateString()}</td>
                <td class="p-2">${payment.amount}</td>
                <td class="p-2">
                  <span class={`px-2 py-1 rounded text-sm ${
                    payment.status === "Paid" ? "bg-green-100 text-green-800" :
                    payment.status === "Late" ? "bg-red-100 text-red-800" :
                    payment.status === "Due Today" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        {#if selectedClient.notes}
          <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium">Notes:</p>
            <p class="text-sm">{selectedClient.notes}</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Form View -->
  {#if activeTab === 'form' && selectedClient}
    <div class="bg-white rounded-lg shadow">
      <div class="p-4">
        <h2 class="text-xl font-bold mb-4 text-blue-600">CLIENT FORM</h2>
        <div class="flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2" for="client-name">Name:</label>
              <input
                id="client-name"
                type="text"
                value={selectedClient.name}
                disabled
                class="w-full p-2 border rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2" for="client-phone">Phone #:</label>
              <input
                id="client-phone"
                type="text"
                value={selectedClient.phoneNumber || "-"}
                disabled
                class="w-full p-2 border rounded-md bg-gray-50"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2" for="payment-frequency">Payment Frequency:</label>
              <input
                id="payment-frequency"
                type="text"
                value={selectedClient.paymentFrequency}
                disabled
                class="w-full p-2 border rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2" for="deposit-paid">Deposit Paid:</label>
              <input
                id="deposit-paid"
                type="text"
                value={`$${selectedClient.depositPaid.toFixed(2)}`}
                disabled
                class="w-full p-2 border rounded-md bg-gray-50"
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
              value={selectedClient.notes}
              disabled
              rows={2}
              class="w-full p-2 border rounded-md bg-gray-50"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>