import { TolgeeEvent, TolgeeInstance } from '@tolgee/core';
import { useEffect } from 'react';
import { useRerender } from './hooks';
import { useTolgeeContext } from './useTolgeeContext';

const DEFAULT_EVENTS: TolgeeEvent[] = ['language', 'pendingLanguage'];

export const useTolgee = (
  events: TolgeeEvent[] = DEFAULT_EVENTS
): TolgeeInstance => {
  const context = useTolgeeContext();
  const rerender = useRerender();

  useEffect(() => {
    const listeners = events.map((e) => context.tolgee.on(e, rerender));
    return () => {
      listeners.forEach((listener) => listener.unsubscribe());
    };
  }, [events.join('')]);

  return context.tolgee;
};
