<!-- src/lib/components/ui/CustomSelect.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { User, ChevronDown, ChevronUp, Plus } from 'lucide-svelte';
    import { clickOutside } from './clickOutside';
  
    export let items: any[] = [];
    export let value: any = null;
    export let placeholder = "Select an option";
    export let showNewOption = false;
    
    let isOpen = false;
    const dispatch = createEventDispatcher();
  
    function handleSelect(item: any) {
      value = item;
      isOpen = false;
      dispatch('select', item);
    }
  
    function handleNewOption() {
      dispatch('new');
      isOpen = false;
    }
  
    function toggle() {
      isOpen = !isOpen;
    }
  
    function handleClickOutside() {
      isOpen = false;
    }
  </script>
  
  <div class="relative w-full" use:clickOutside on:clickOutside={handleClickOutside}>
    <button
      type="button"
      class="w-full flex items-center justify-between p-2 border rounded-md bg-white hover:bg-gray-50"
      on:click={toggle}
    >
      <div class="flex items-center gap-2">
        <User class="h-4 w-4" />
        <span class="text-sm">
          {#if value}
            {value.name}
          {:else}
            {placeholder}
          {/if}
        </span>
      </div>
      <span class="text-gray-400">
        {#if isOpen}
          <ChevronUp class="h-4 w-4" />
        {:else}
          <ChevronDown class="h-4 w-4" />
        {/if}
      </span>
    </button>
  
    {#if isOpen}
      <div class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
        {#if showNewOption}
          <button
            class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 text-blue-600"
            on:click={handleNewOption}
          >
            <Plus class="h-4 w-4" />
            <span>New Client</span>
          </button>
          <div class="border-t"></div>
        {/if}
        
        {#each items as item (item.id)}
          <button
            class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
            class:bg-gray-50={value?.id === item.id}
            on:click={() => handleSelect(item)}
          >
            <User class="h-4 w-4" />
            <span>{item.name}</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>