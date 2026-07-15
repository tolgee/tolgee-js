import { MAX_LANGUAGES_SELECTED } from '../../../constants';
import { getInitialLanguages, setPreferredLanguages } from './tools';

describe('getInitialLanguages', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('puts the base language first in the fallback selection', () => {
    const available = ['de', 'fr', 'en'];
    expect(getInitialLanguages(available, 'en')).toEqual(['en', 'de', 'fr']);
  });

  it('caps the selection to MAX_LANGUAGES_SELECTED', () => {
    const available = ['en', ...Array.from({ length: 10 }, (_, i) => `l${i}`)];
    expect(getInitialLanguages(available, 'en')).toHaveLength(
      MAX_LANGUAGES_SELECTED
    );
  });

  it('includes the base language by default even when it sorts past the cap', () => {
    const rawTags = ['ar', 'ar-PS', 'ar-SA', 'az', 'cs', 'de', 'en', 'es'];
    const selected = getInitialLanguages(rawTags, 'en');
    expect(selected[0]).toBe('en');
    expect(selected).toHaveLength(MAX_LANGUAGES_SELECTED);
  });

  it('keeps the base language on top when a stored preference includes it past the cap', () => {
    setPreferredLanguages(['ar', 'ar-PS', 'ar-SA', 'az', 'cs', 'en']);
    const rawTags = ['ar', 'ar-PS', 'ar-SA', 'az', 'cs', 'en'];
    const selected = getInitialLanguages(rawTags, 'en');
    expect(selected[0]).toBe('en');
    expect(selected).toHaveLength(MAX_LANGUAGES_SELECTED);
  });

  it('respects an explicit deselection of the base language', () => {
    setPreferredLanguages(['cs', 'de']);
    const rawTags = ['ar', 'cs', 'de', 'en'];
    expect(getInitialLanguages(rawTags, 'en')).toEqual(['cs', 'de']);
  });

  it('does not duplicate the base language when it is already preferred', () => {
    setPreferredLanguages(['en', 'cs']);
    const rawTags = ['ar', 'cs', 'de', 'en'];
    expect(getInitialLanguages(rawTags, 'en')).toEqual(['en', 'cs']);
  });
});
