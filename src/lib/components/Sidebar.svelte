<!-- src/lib/components/Sidebar.svelte -->
<script lang="ts">
    import { User, Home, FileText, Users, Settings, PlusCircle } from 'lucide-svelte';
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    let isSidebarExpanded = false;
    let showSettings = false;
    let currentView = 'home';
    
    const navigationItems = [
      { icon: Home, label: 'Home', view: 'home' },
      { icon: FileText, label: 'Reports', view: 'reports' },
      { icon: Users, label: 'Client Data', view: 'client-data' },
      { icon: Users, label: 'Users', view: 'users' }
    ];
  
    function handleNavigation(view: string) {
      currentView = view;
      dispatch('navigate', { view });
    }
  </script>
  
  <div
    class="fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-50 flex flex-col"
    class:w-64={isSidebarExpanded}
    class:w-20={!isSidebarExpanded}
    role="navigation"
    aria-label="Main navigation"
    on:mouseenter={() => isSidebarExpanded = true}
    on:mouseleave={() => isSidebarExpanded = false}
  >
    <!-- Logo Area -->
    <div class="p-4 pt-8 pb-8 border-b flex-shrink-0"> <!-- Changed from p-4 to add more vertical padding -->
        <div class="h-12 flex items-center">
        <img 
            src="/cv-logo-text-e.PNG" 
            alt="Credit Valee Logi"
            class="w-60 h-20 flex-shrink-0 rounded object-contain"
        />
        <span class="ml-3 font-bold transition-opacity duration-300" class:opacity-100={isSidebarExpanded} class:opacity-0={!isSidebarExpanded}>
        </span>
        </div>
    </div>
    
    <!-- User Profile -->
    <div class="p-4 pt-8 border-b flex-shrink-0"> <!-- Added pt-8 for extra top padding -->
        <div class="flex items-center">
        <div class="w-12 h-12 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center">
            <User class="w-6 h-6 text-white" />
        </div>
        <div class="ml-3 transition-opacity duration-300" class:opacity-100={isSidebarExpanded} class:opacity-0={!isSidebarExpanded}>
            <div class="font-medium">User</div>
            <div class="text-sm text-gray-500">Admin</div>
        </div>
        </div>
    </div>
  
  
    <!-- Actions Section -->
    <div class="p-2 border-b flex-shrink-0">
      <button
        on:click={() => handleNavigation('client-form')}
        class="w-full p-2 flex items-center rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
      >
        <div class="w-12 h-12 flex items-center justify-center flex-shrink-0">
          <PlusCircle class="w-6 h-6" />
        </div>
        <span class="transition-opacity duration-300 font-medium" class:opacity-100={isSidebarExpanded} class:opacity-0={!isSidebarExpanded}>
          New Client
        </span>
      </button>
    </div>
  
    <!-- Main Navigation -->
    <nav class="p-2 flex-shrink-0">
      <ul class="space-y-2">
        {#each navigationItems as { icon: Icon, label, view }}
          <li>
            <button
              on:click={() => handleNavigation(view)}
              class="w-full p-2 flex items-center rounded-md transition-colors"
              class:bg-blue-50={currentView === view}
              class:text-blue-600={currentView === view}
              class:hover:bg-gray-100={currentView !== view}
            >
              <div class="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <svelte:component this={Icon} class="w-6 h-6" />
              </div>
              <span class="transition-opacity duration-300" class:opacity-100={isSidebarExpanded} class:opacity-0={!isSidebarExpanded}>
                {label}
              </span>
            </button>
          </li>
        {/each}
      </ul>
    </nav>
  
    <!-- Settings at bottom -->
    <div class="p-2 border-t mt-auto relative flex-shrink-0">
      <button 
        on:click={() => showSettings = !showSettings}
        class="w-full p-2 flex items-center rounded-md hover:bg-gray-100 transition-colors"
      >
        <div class="w-12 h-12 flex items-center justify-center flex-shrink-0">
          <Settings class="w-6 h-6 text-gray-500" />
        </div>
        <span class="transition-opacity duration-300 text-gray-500" class:opacity-100={isSidebarExpanded} class:opacity-0={!isSidebarExpanded}>
          Settings
        </span>
      </button>
      
      {#if showSettings}
        <div class="absolute bottom-full left-0 mb-2 bg-white rounded-md shadow-lg py-1 min-w-40 z-50">
          <button class="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">
            Profile
          </button>
          <button class="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">
            Site Settings
          </button>
        </div>
      {/if}
    </div>
  </div>