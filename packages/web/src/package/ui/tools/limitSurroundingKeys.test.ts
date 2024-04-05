import { KeyInfo, limitSurroundingKeys } from './limitSurroundingKeys';

function generateKeys(num: number): KeyInfo[] {
  return [...Array(num)].map((_, i) => ({
    keyName: `key_${i}`,
  }));
}

describe('limit surrounding keys', () => {
  it('works when number of keys is low', () => {
    const keys = generateKeys(10);
    expect(limitSurroundingKeys(keys, { keyName: 'key_0' })).toHaveLength(
      keys.length
    );
  });

  it('removes the end', () => {
    const keys = generateKeys(1000);
    const result = limitSurroundingKeys(keys, {
      keyName: 'key_0',
    });
    expect(result).toHaveLength(100);
    expect(result[0].keyName).toEqual('key_0');
  });

  it('removes the begining', () => {
    const keys = generateKeys(1000);
    const result = limitSurroundingKeys(keys, {
      keyName: 'key_999',
    });
    expect(result).toHaveLength(100);
    expect(result[result.length - 1].keyName).toEqual('key_999');
  });

  it('removes both end and begining', () => {
    const keys = generateKeys(1000);
    const result = limitSurroundingKeys(keys, {
      keyName: 'key_500',
    });
    expect(result).toHaveLength(100);
    expect(result[0].keyName).toEqual('key_450');
  });
});
