<!-- Component: Sidebar.svelte
     Description: Main navigation sidebar component that handles routing and user interface elements.
     Features: Responsive design, collapsible navigation, user profile, and settings menu -->
     <script lang="ts">
        import { User, Home, FileText, Users, Settings, PlusCircle, X } from 'lucide-svelte';
        import { createEventDispatcher } from 'svelte';
        
        // Event dispatcher for navigation events
        const dispatch = createEventDispatcher();
        let showSettings = false;
        let currentView = 'home';
        
        // Navigation menu items configuration
        const navigationItems = [
            { icon: Home, label: 'Home', view: 'home' },
            { icon: FileText, label: 'Reports', view: 'reports' },
            { icon: Users, label: 'Client Data', view: 'client-data' },
            { icon: Users, label: 'Users', view: 'users' }
        ];
     
        // Handler for navigation events
        function handleNavigation(view: string) {
            currentView = view;
            dispatch('navigate', { view });
        }
    </script>
     
    <!-- Main Sidebar Container -->
    <div
        class="fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-50 flex flex-col
               md:w-20 hover:md:w-64 group"
        role="navigation"
        aria-label="Main navigation"
    >
        <!-- Mobile Close Button -->
        <button 
            class="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            on:click={() => dispatch('navigate', { view: currentView })}
            aria-label="Close menu"
        >
            <X class="w-6 h-6" />
        </button>
     
        <!-- Logo Section -->
        <div class="p-4 pt-8 pb-8 border-b flex-shrink-0">
            <div class="h-12 flex items-center justify-center md:justify-start">
                <img 
                    src="/cv-logo-text-e.PNG" 
                    alt="Navigation Bar Logo"
                    class="w-auto h-12 md:h-20 object-contain transition-all duration-300"
                />
            </div>
        </div>
      
        <!-- User Profile Section -->
        <div class="p-4 pt-8 border-b flex-shrink-0">
            <div class="flex items-center justify-center md:justify-start">
                <div class="w-10 h-10 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center">
                    <User class="w-6 h-6 text-white" />
                </div>
                <div class="hidden md:block ml-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div class="font-medium">User</div>
                    <div class="text-sm text-gray-500">Admin</div>
                </div>
            </div>
        </div>
     
        <!-- New Client Button Section -->
        <div class="p-2 border-b flex-shrink-0">
            <button
                on:click={() => handleNavigation('client-form')}
                class="w-full h-14 p-2 flex items-center rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
            >
                <div class="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <PlusCircle class="w-5 h-5" />
                </div>
                <span class="hidden md:block ml-3 opacity-0 group-hover:opacity-100 transition-all duration-300">New Client</span>
            </button>
        </div>
     
        <!-- Main Navigation Menu -->
        <nav class="p-2 flex-shrink-0">
            <ul class="space-y-2">
                {#each navigationItems as { icon: Icon, label, view }}
                    <li>
                        <button
                            on:click={() => handleNavigation(view)}
                            class="w-full h-14 p-2 flex items-center rounded-md transition-colors"
                            class:bg-blue-50={currentView === view}
                            class:text-blue-600={currentView === view}
                            class:hover:bg-gray-100={currentView !== view}
                        >
                            <div class="w-10 h-10 flex items-center justify-center flex-shrink-0">
                                <svelte:component this={Icon} class="w-5 h-5" />
                            </div>
                            <span class="hidden md:block ml-3 opacity-0 group-hover:opacity-100 transition-all duration-300">{label}</span>
                        </button>
                    </li>
                {/each}
            </ul>
        </nav>
     
        <!-- Settings Section -->
        <div class="p-2 border-t mt-auto relative flex-shrink-0">
            <button 
                on:click={() => showSettings = !showSettings}
                class="w-full h-14 p-2 flex items-center rounded-md hover:bg-gray-100 transition-colors"
            >
                <div class="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <Settings class="w-5 h-5 text-gray-500" />
                </div>
                <span class="hidden md:block ml-3 opacity-0 group-hover:opacity-100 transition-all duration-300 text-gray-500">Settings</span>
            </button>
            
            <!-- Settings Dropdown Menu -->
            {#if showSettings}
                <div class="absolute bottom-full left-0 mb-2 bg-white rounded-md shadow-lg py-1 w-48 z-50">
                    <button class="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Profile</button>
                    <button class="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">Site Settings</button>
                </div>
            {/if}
        </div>
    </div>