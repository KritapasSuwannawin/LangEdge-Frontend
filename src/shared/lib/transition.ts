import React from 'react';

export const fadingStyle = (state: string, duration = 150): React.CSSProperties => {
  return {
    transition: `opacity ${duration.toString()}ms ease-out`,
    opacity: 0,
    ...({
      entering: { opacity: 1 },
      entered: { opacity: 1 },
      exiting: { opacity: 0 },
      exited: { opacity: 0 },
    } as Record<string, React.CSSProperties>)[state],
  };
};
