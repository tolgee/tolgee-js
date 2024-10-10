jest.autoMockOff();
import { InvisibleWrapper, MESSAGE_END } from './InvisibleWrapper';

const key1 = {
  key: 'key1',
  translation: 'translation1',
  defaultValue: 'defaultValue1',
};
const key2 = {
  key: 'key2',
  translation: 'translation2',
  defaultValue: 'defaultValue2',
};
const keyWithMessageEndInside = {
  key: `key${MESSAGE_END}3`,
  translation: `translation${MESSAGE_END}3`,
  defaultValue: `defaultValue${MESSAGE_END}3`,
};

describe('invisible wrapper', () => {
  it('wraps and unwraps', () => {
    const wrapper = InvisibleWrapper({ fullKeyEncode: false });

    const wrapped = wrapper.wrap(key1);
    const unwraped = wrapper.unwrap(wrapped);
    expect(unwraped.text).toEqual(key1.translation);
    expect(unwraped.keys[0].key).toEqual(key1.key);
    expect(unwraped.keys[0].defaultValue).toEqual(key1.defaultValue);
  });

  it('wraps and unwraps nested keys', () => {
    const wrapper = InvisibleWrapper({ fullKeyEncode: false });

    const wrapped = wrapper.wrap({
      ...key1,
      translation: key1.translation + wrapper.wrap(key2),
    });
    const unwraped = wrapper.unwrap(wrapped);
    expect(unwraped.text).toEqual(key1.translation + key2.translation);
    expect(unwraped.keys[0].key).toEqual(key2.key);
    expect(unwraped.keys[0].defaultValue).toEqual(key2.defaultValue);
    expect(unwraped.keys[1].key).toEqual(key1.key);
    expect(unwraped.keys[1].defaultValue).toEqual(key1.defaultValue);
  });

  it('works with external fully encoded keys', () => {
    // simulating external wrapper
    const externalWrapper = InvisibleWrapper({ fullKeyEncode: true });
    const wrapper = InvisibleWrapper({ fullKeyEncode: false });

    const wrapped = externalWrapper.wrap(key1);
    const unwraped = wrapper.unwrap(wrapped);
    expect(unwraped.text).toEqual(key1.translation);
    expect(unwraped.keys[0].key).toEqual(key1.key);
    // doesn't include default value
    expect(unwraped.keys[0].defaultValue).toEqual(undefined);
  });

  it('wraps and unwraps nested keys fully encoded', () => {
    // simulating external wrapper
    const externalWrapper = InvisibleWrapper({ fullKeyEncode: true });
    const wrapper = InvisibleWrapper({ fullKeyEncode: false });

    const wrapped = externalWrapper.wrap({
      ...key1,
      translation: key1.translation + externalWrapper.wrap(key2),
    });
    const unwraped = wrapper.unwrap(wrapped);
    expect(unwraped.text).toEqual(key1.translation + key2.translation);
    expect(unwraped.keys[0].key).toEqual(key2.key);
    expect(unwraped.keys[0].defaultValue).toEqual(undefined);
    expect(unwraped.keys[1].key).toEqual(key1.key);
    expect(unwraped.keys[1].defaultValue).toEqual(undefined);
  });

  it('wraps and unwraps nested keys newlines fully encoded', () => {
    // simulating external wrapper
    const externalWrapper = InvisibleWrapper({ fullKeyEncode: true });
    const wrapper = InvisibleWrapper({ fullKeyEncode: false });

    const wrapped = externalWrapper.wrap({
      ...key1,
      translation:
        key1.translation + externalWrapper.wrap(keyWithMessageEndInside),
    });
    const unwraped = wrapper.unwrap(wrapped);
    expect(unwraped.text).toEqual(
      key1.translation + keyWithMessageEndInside.translation
    );
    expect(unwraped.keys[0].key).toEqual(keyWithMessageEndInside.key);
    expect(unwraped.keys[0].defaultValue).toEqual(undefined);
    expect(unwraped.keys[1].key).toEqual(key1.key);
    expect(unwraped.keys[1].defaultValue).toEqual(undefined);
  });
});
