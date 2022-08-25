jest.dontMock('./ValueMemory');
import { ValueMemory } from './ValueMemory';

describe('Value memory', () => {
  let valueMemory: ValueMemory;

  beforeEach(() => {
    valueMemory = new ValueMemory();
  });

  it('stores key correctly', () => {
    const num = valueMemory.valueToNumber('abcd');
    expect(num).toEqual(0);
    expect(valueMemory.valueToNumber('abcd')).toEqual(0);
  });

  it('retrieves key correctly', () => {
    const num = valueMemory.valueToNumber('abcd');
    expect(valueMemory.numberToValue(num)).toEqual('abcd');
  });

  it('retrieves missing key correctly', () => {
    expect(valueMemory.numberToValue(100)).toEqual(undefined);
  });
});
