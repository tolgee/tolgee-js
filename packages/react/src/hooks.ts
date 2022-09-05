import { useCallback, useState } from 'react';

export const useRerender = () => {
  const [_, setCounter] = useState(0);

  const rerender = useCallback(() => {
    setCounter((num) => num + 1);
  }, [setCounter]);
  return rerender;
};
