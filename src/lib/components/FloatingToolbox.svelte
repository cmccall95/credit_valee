<!-- src/lib/components/FloatingToolbox.svelte -->
<script lang="ts">
    import { Wrench, Printer, Eye, EyeOff, Move, Pin, PinOff } from 'lucide-svelte';
    import { slide } from 'svelte/transition';
    
    let isOpen = false;
    let isDocked = true;
    let position = { x: 20, y: 20 };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };

    function handleDragStart(e: MouseEvent) {
        isDragging = true;
        dragStart = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    }

    function handleDragEnd() {
        isDragging = false;
    }

    function handleDrag(e: MouseEvent) {
        if (isDragging) {
            position = {
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            };
        }
    }
</script>

<div 
    class="fixed transition-all duration-200"
    class:right-0={isDocked}
    class:top-20={isDocked}
    style={!isDocked ? `left: ${position.x}px; top: ${position.y}px` : ''}
    on:mousemove={!isDocked ? handleDrag : null}
    on:mouseup={handleDragEnd}
    on:mouseleave={handleDragEnd}
    role="toolbar"
    aria-label="Floating toolbox"
    tabindex="0"
>
    <!-- Toggle Button -->
    <button
        on:click={() => isOpen = !isOpen}
        class="p-2 bg-gray-800 text-white rounded-l-lg shadow-lg hover:bg-gray-700 transition-colors"
        on:mousedown={!isDocked ? handleDragStart : null}
        aria-expanded={isOpen}
        aria-haspopup="true"
    >
        <Wrench class="w-6 h-6" />
    </button>

    <!-- Toolbox Panel -->
    {#if isOpen}
        <div class="bg-gray-800 text-gray-100 p-4 rounded-l-lg shadow-xl w-64 transition-all duration-300"
             transition:slide={{ duration: 200 }}>
            <!-- Header -->
            <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-600">
                <h3 class="font-semibold">Tools</h3>
                <button
                    on:click={() => isDocked = !isDocked}
                    class="p-1 hover:bg-gray-700 rounded transition-colors"
                    title={isDocked ? "Undock" : "Dock"}
                    aria-label={isDocked ? "Undock toolbox" : "Dock toolbox"}
                >
                    {#if isDocked}
                        <PinOff class="w-4 h-4" />
                    {:else}
                        <Pin class="w-4 h-4" />
                    {/if}
                </button>
            </div>

            <!-- Tool Options -->
            <div class="space-y-3">
                <button class="w-full flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition-colors">
                    <Printer class="w-5 h-5" />
                    <span>Print View</span>
                </button>

                <button class="w-full flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition-colors">
                    <Eye class="w-5 h-5" />
                    <span>Show Status Column</span>
                </button>

                <button class="w-full flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition-colors">
                    <EyeOff class="w-5 h-5" />
                    <span>Hide Comments</span>
                </button>

                {#if !isDocked}
                    <div class="p-2 text-gray-400 flex items-center gap-2 text-sm">
                        <Move class="w-4 h-4" />
                        <span>Drag to move</span>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    /* Optional: Add any component-specific styles here */
    :global(.floating-toolbox-enter) {
        transform: translateX(100%);
    }
    :global(.floating-toolbox-enter-active) {
        transform: translateX(0%);
        transition: transform 200ms ease-in-out;
    }
    :global(.floating-toolbox-exit) {
        transform: translateX(0%);
    }
    :global(.floating-toolbox-exit-active) {
        transform: translateX(100%);
        transition: transform 200ms ease-in-out;
    }
</style>