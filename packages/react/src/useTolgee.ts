import { TolgeeEvent, TolgeeInstance } from '@tolgee/web';
import { useEffect } from 'react';
import { useRerender } from './hooks';
import { useTolgeeContext } from './useTolgeeContext';

export const useTolgee = (events?: TolgeeEvent[]): TolgeeInstance => {
  const { tolgee } = useTolgeeContext();

  const { rerender } = useRerender();
  const renderedLanguage = tolgee.getLanguage();

  useEffect(() => {
    const listeners = events?.map((e) => tolgee.on(e, rerender));
    // A language change between this render and the subscription would be missed.
    if (
      events?.includes('language') &&
      tolgee.getLanguage() !== renderedLanguage
    ) {
      rerender();
    }
    return () => {
      listeners?.forEach((listener) => listener.unsubscribe());
    };
  }, [events?.join(':')]);

  return tolgee;
};
