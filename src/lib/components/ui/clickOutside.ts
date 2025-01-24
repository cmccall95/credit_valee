// src/lib/components/ui/clickOutside.ts
export function clickOutside(node: HTMLElement) {
    const handleClick = (event: MouseEvent) => {
      if (!node.contains(event.target as Node)) {
        node.dispatchEvent(new CustomEvent('clickOutside'));
      }
    };
  
    document.addEventListener('click', handleClick, true);
  
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }
  
  declare global {
    namespace svelteHTML {
      interface HTMLAttributes<T> {
        'on:clickOutside'?: (event: CustomEvent) => void;
      }
    }
  }