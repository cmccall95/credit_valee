<!-- src/lib/components/Reports.svelte -->
<script lang="ts">
    import { clients } from '$lib/stores';
    import type { Client, Payment } from '$lib/types';
    import Card from '$lib/components/ui/card/card.svelte';
    import CardHeader from '$lib/components/ui/card/card-header.svelte';
    import CardContent from '$lib/components/ui/card/card-content.svelte';
    
    export let selectedClient: Client | null = null;
    let activeTab = 'reports';
    let dateRange = {
      start: new Date().toISOString().split("T")[0],
      end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    };
    let statusFilter = "All";
    let today = new Date();
  
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
  
      return $clients.flatMap(client => generatePaymentSchedule(client)).filter(payment => {
        const paymentDate = new Date(payment.date);
        const dateInRange = paymentDate >= startDate && paymentDate <= endDate;
        const statusMatches = statusFilter === "All" || payment.status === statusFilter;
        return dateInRange && statusMatches;
      });
    }
  </script>
  
  <div>
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
    <div class="grid grid-cols-2 gap-2 mb-4">
      {#each ['Reports', 'Schedule'] as tab}
        <button
          on:click={() => activeTab = tab.toLowerCase()}
          class="p-2 text-center rounded-t-md transition-colors
            {activeTab === tab.toLowerCase() 
              ? 'bg-white border-b-2 border-blue-500 font-medium' 
              : 'bg-gray-100'}"
        >
          {tab}
        </button>
      {/each}
    </div>
  
    <!-- Reports Tab Content -->
    {#if activeTab === 'reports'}
      <Card>
        <CardHeader>
          <h2 class="text-lg font-semibold">Payment Reports</h2>
        </CardHeader>
        <CardContent>
          <!-- Filters -->
          <div class="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md mb-4">
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
  
          <!-- Payments Table -->
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
        </CardContent>
      </Card>
    {/if}
  
    <!-- Schedule Tab Content -->
    {#if activeTab === 'schedule' && selectedClient}
      <Card>
        <CardHeader>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">Payment Schedule</h2>
            <p class="text-sm">
              Total Contract: ${generatePaymentSchedule(selectedClient).reduce((sum, payment) => sum + payment.amount, 0)}
            </p>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    {/if}
  </div>