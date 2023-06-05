jest.autoMockOff();
import { InvisibleWrapper } from './InvisibleWrapper';

describe('invisible wrapper', () => {
  it('wraps and unwraps', () => {
    const wrapper = InvisibleWrapper({ fullKeyEncode: false });
    const key = 'hello';
    const translation = 'world';
    const defaultValue = '!';

    const wrapped = wrapper.wrap({ key, translation, defaultValue });
    const unwraped = wrapper.unwrap(wrapped);
    expect(unwraped.text).toEqual(translation);
    expect(unwraped.keys[0].key).toEqual(key);
    expect(unwraped.keys[0].defaultValue).toEqual(defaultValue);
  });

  it('wraps and unwraps full key', () => {
    const wrapper = InvisibleWrapper({ fullKeyEncode: true });
    const key = 'hello';
    const translation = 'world';
    const defaultValue = '!';

    const wrapped = wrapper.wrap({ key, translation, defaultValue });
    const unwraped = wrapper.unwrap(wrapped);
    expect(unwraped.text).toEqual(translation);
    expect(unwraped.keys[0].key).toEqual(key);
    expect(unwraped.keys[0].defaultValue).toEqual(defaultValue);
  });
});
