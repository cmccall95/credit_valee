<script lang="ts">
  import { onMount } from 'svelte';
  import { clients } from '$lib/stores';
  import type { Client, Payment } from '$lib/types';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import ClientForm from '$lib/components/ClientForm.svelte';
  import Reports from '$lib/components/Reports.svelte';

  let activeView = 'home'; // Changed from activeTab to activeView for consistency
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

  function handleNavigation(event: CustomEvent) {
    const { view } = event.detail;
    activeView = view; // Using activeView instead of currentView
    
    // Reset selectedClient when navigating to new client form
    if (view === 'client-form') {
      selectedClient = null;
    }
  }
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

<div class="min-h-screen bg-gray-50">
  <Sidebar on:navigate={handleNavigation} />

  <div class="ml-20 p-4">
    <div class="max-w-4xl mx-auto">
      {#if activeView === 'home'}
      <!-- Home content -->
      <div class="bg-white rounded-lg shadow p-4">
        <h1 class="text-2xl font-bold mb-4">Welcome to Credit Valee</h1>
        <!-- Add your home page content here -->
      </div>
      {/if}

      {#if activeView === 'client-form'}
      <ClientForm {selectedClient} />
      {/if}

      <!-- Reports View -->
      {#if activeView === 'reports'}
      <Reports {selectedClient} />
      {/if}
    </div>
  </div>
</div>