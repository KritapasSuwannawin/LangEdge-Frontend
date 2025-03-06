import { useEffect, RefObject } from 'react';

import { SetState } from '../types';

const useClickOutsideHandler = (state: boolean, setState: SetState<boolean>, elementRefArr: RefObject<Element>[]) => {
  useEffect(() => {
    if (!state) {
      return;
    }

    function clickOutsideHandler(event: MouseEvent) {
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
        setState(false);
      }
    }

    document.addEventListener('mousedown', clickOutsideHandler);

    return () => {
      setTimeout(() => {
        document.removeEventListener('mousedown', clickOutsideHandler);
      }, 0);
    };
  }, [state, setState, elementRefArr]);
};

export default useClickOutsideHandler;
