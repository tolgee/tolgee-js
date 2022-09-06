import { EventEmitterSelective } from './EventEmitterSelective';

it('subscribes and unsubscribes', () => {
  const emitter = EventEmitterSelective<void>();
  const handler = jest.fn();
  const listener = emitter.listen(handler);
  listener.subscribeToKey('test');
  listener.subscribeToKey('abcd');

  emitter.emit(undefined, 'test');
  expect(handler).toBeCalledTimes(1);
  listener.unsubscribe();
  emitter.emit(undefined);
  expect(handler).toBeCalledTimes(1);
});
