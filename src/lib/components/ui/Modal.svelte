<!-- src/lib/components/ui/Modal.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { X } from 'lucide-svelte';
    import { fade, scale } from 'svelte/transition';
  
    export let isOpen = false;
    export let title = '';
  
    const dispatch = createEventDispatcher();
  
    function close() {
      dispatch('close');
    }
 </script>
  
 {#if isOpen}
    <div class="fixed inset-0 z-50" transition:fade>
        <div 
            class="absolute inset-0 bg-black/50" 
            on:click={close}
            on:keydown={(e) => e.key === 'Escape' && close()}
            role="button"
            tabindex="0"
        ></div>
        <div class="fixed inset-0 flex items-center justify-center p-4">
            <div 
                class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                transition:scale={{duration: 200}}
            >
                <!-- Header (Fixed) -->
                <div class="flex items-center justify-between p-4 border-b shrink-0">
                    <h2 class="text-lg font-semibold">{title}</h2>
                    <button 
                        class="p-1 hover:bg-gray-100 rounded-full"
                        on:click={close}
                    >
                        <X class="w-5 h-5" />
                    </button>
                </div>
  
                <!-- Content (Scrollable) -->
                <div class="p-4 overflow-y-auto flex-1">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
 {/if}