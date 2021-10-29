import { mockTolgee } from '$lib/__testUtil/mockTolgee';
import { getLanguageStore } from '$lib/getLanguageStore';

const tolgeeMock = mockTolgee();

jest.mock('./getTolgeeContext', () => () => ({
  tolgee: tolgeeMock.tolgee,
}));

describe('getLanguageStore', () => {
  const subscribeCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('gets the lang', () => {
    const languageStore = getLanguageStore();
    languageStore.subscribe(subscribeCallback);

    expect(tolgeeMock.getLangMock).toHaveBeenCalledTimes(1);
    expect(subscribeCallback).toHaveBeenCalledTimes(1);
    expect(subscribeCallback).toHaveBeenCalledWith('mocked-lang');
  });

  it('sets the lang', () => {
    const languageStore = getLanguageStore();
    languageStore.subscribe(subscribeCallback);
    languageStore.set('en');

    expect(tolgeeMock.setLangMock).toHaveBeenCalledTimes(2);
    expect(tolgeeMock.setLangMock).toHaveBeenCalledWith('mocked-lang');
    expect(tolgeeMock.setLangMock).toHaveBeenCalledWith('en');
    expect(subscribeCallback).toHaveBeenCalledTimes(2);
    expect(subscribeCallback).toHaveBeenCalledWith('mocked-lang');
    expect(subscribeCallback).toHaveBeenCalledWith('en');
  });
});
