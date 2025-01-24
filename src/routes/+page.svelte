<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { clients } from '$lib/stores';
  import type { Client, Payment } from '$lib/types';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import ClientForm from '$lib/components/ClientForm.svelte';
  import Reports from '$lib/components/Reports.svelte';
  import { Menu } from 'lucide-svelte';
	import { page } from '$app/state';

  let activeView = 'home'; 
  let selectedClient: Client | null = null;
  let isMobileMenuOpen = false;
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
    isMobileMenuOpen = false; // Close mobile menu after navigation
    
    // Reset selectedClient when navigating to new client form
    if (view === 'client-form') {
      selectedClient = null;
    }
  }

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

</script>

<div class="min-h-screen bg-gray-50">
  <!-- Mobile Header -->
  <div class="md:hidden fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
    <div class="flex items-center justify-between p-4">
      <button 
        class="p-2 hover:bg-gray-100 rounded-lg"
        on:click={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <Menu class="w-6 h-6" />
      </button>
      <img 
        src="/cv-logo-text-e.PNG" 
        alt="Credit Valee Logo"
        class="h-8 object-contain"
      />
      <div class="w-8"></div> <!-- Spacer for alignment -->
    </div>
  </div>

  <!-- Mobile Menu Overlay -->
  {#if isMobileMenuOpen}
    <button 
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      on:click={toggleMobileMenu}
      on:keydown={(e) => e.key === 'Escape' && toggleMobileMenu()}
      aria-label="Close menu overlay"
    ></button>
  {/if}

  <!-- Sidebar - Hidden on mobile, shown on desktop -->
  <div class="hidden md:block">
    <Sidebar on:navigate={handleNavigation} />
  </div>

  <!-- Mobile Sidebar - Slide in from left -->
  {#if isMobileMenuOpen}
    <div 
      class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform md:hidden"
      class:translate-x-0={isMobileMenuOpen}
      class:-translate-x-full={!isMobileMenuOpen}
    >
      <Sidebar on:navigate={handleNavigation} />
    </div>
  {/if}

  <!-- Main Content -->
  <div class="md:ml-20 p-2 sm:p-4 mt-16 md:mt-0">
    <div class="container max-w-7xl mx-auto">
      {#if activeView === 'home'}
      <div class="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
        <h1 class="text-xl md:text-2xl lg:text-3xl font-bold mb-4">Welcome to Credit Valee</h1>
      </div>
      {/if}

      {#if activeView === 'client-form'}
      <ClientForm {selectedClient} />
      {/if}

      {#if activeView === 'reports'}
      <Reports {selectedClient} />
      {/if}
    </div>
  </div>
</div>