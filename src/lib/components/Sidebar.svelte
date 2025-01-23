<!-- src/lib/components/Sidebar.svelte -->
<script lang="ts">
    import { User, Home, FileText, Users, Settings, PlusCircle } from 'lucide-svelte';
    
    let isSidebarExpanded = false;
    let showSettings = false;
    let currentView = 'reports';
    
    const navigationItems = [
      { icon: Home, label: 'Home', view: 'home' },
      { icon: FileText, label: 'Reports', view: 'reports' },
      { icon: Users, label: 'Client Data', view: 'client-data' },
      { icon: Users, label: 'Users', view: 'users' }
    ];
  </script>
  
  <div
    class="fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-50 flex flex-col"
    role="navigation"
    aria-label="Main navigation"
    class:w-64={isSidebarExpanded}
    class:w-20={!isSidebarExpanded}
    on:mouseenter={() => isSidebarExpanded = true}
    on:mouseleave={() => isSidebarExpanded = false}
  >
    <!-- User Profile -->
    <div class="p-4 border-b flex-shrink-0">
      <div class="flex items-center">
        <div class="w-12 h-12 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center">
          <User class="w-6 h-6 text-white" />
        </div>
        <div class="ml-3 transition-opacity duration-300" class:opacity-100={isSidebarExpanded} class:opacity-0={!isSidebarExpanded}>
          <div class="font-medium">John Doe</div>
          <div class="text-sm text-gray-500">Admin</div>
        </div>
      </div>
    </div>
  
    <!-- Logo Area -->
    <div class="p-4 border-b flex-shrink-0">
      <div class="h-12 flex items-center">
        <div class="w-12 h-12 flex-shrink-0 bg-gray-200 rounded"></div>
        <span class="ml-3 font-bold transition-opacity duration-300" class:opacity-100={isSidebarExpanded} class:opacity-0={!isSidebarExpanded}>
          LOGO
        </span>
      </div>
    </div>
  
    <!-- Actions Section -->
    <div class="p-2 border-b flex-shrink-0">
      <button
        on:click={() => currentView = 'new-client'}
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
              on:click={() => currentView = view}
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