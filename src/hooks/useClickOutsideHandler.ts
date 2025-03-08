import { useEffect, RefObject } from 'react';

const useClickOutsideHandler = (state: boolean, clickOutsideHandler: () => void, elementRefArr: RefObject<Element>[]) => {
  useEffect(() => {
    if (!state) {
      return;
    }

    function clickHandler(event: MouseEvent) {
      const clickedElement = event.target as HTMLElement;

      function isToastifyClicked() {
        let node: HTMLElement | null = clickedElement;

        while (node && node instanceof HTMLElement) {
          if (node.classList.contains('Toastify')) {
            return true;
          }

          node = node.parentNode as HTMLElement | null;
        }

        return false;
      }

      if (elementRefArr.every((elementRef) => !elementRef.current?.contains(clickedElement)) && !isToastifyClicked()) {
        clickOutsideHandler();
      }
    }

    document.addEventListener('mousedown', clickHandler);

    return () => {
      setTimeout(() => {
        document.removeEventListener('mousedown', clickHandler);
      }, 0);
    };
  }, [state, clickOutsideHandler, elementRefArr]);
};

export default useClickOutsideHandler;
