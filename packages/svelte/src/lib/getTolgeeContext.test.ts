import { getTolgeeContext } from '$lib/index';

const mockedContext = { context: 'hello' };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getContextMock = jest.fn((..._) => mockedContext);

jest.mock('svelte', () => ({
  getContext: (...args: unknown[]) => getContextMock(...args),
}));

describe('getTolgeeContext', () => {
  it('returns context', () => {
    const context = getTolgeeContext();
    expect(getContextMock).toHaveBeenCalledTimes(1);
    expect(getContextMock).toHaveBeenCalledWith('tolgeeContext');
    expect(context).toEqual(mockedContext);
  });

  it('fails when context not provided', () => {
    getContextMock.mockReturnValueOnce(undefined);
    expect(() => {
      getTolgeeContext();
    }).toThrow(
      'Tolgee context is undefined. Trying to use getTranslate method or T component outside TolgeeProvider?'
    );
  });
});
