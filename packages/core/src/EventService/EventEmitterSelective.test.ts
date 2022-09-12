import { EventEmitterSelective } from './EventEmitterSelective';

describe('event emitter selective', () => {
  it('subscribes to key', () => {
    const emitter = EventEmitterSelective<void>();
    const handler = jest.fn();
    const listener = emitter.listenSome(handler);
    listener.subscribeToKey({ key: 'test' });
    listener.subscribeToKey({ key: 'abcd' });

    emitter.emit(undefined, { key: 'test' });
    emitter.emit(undefined, { key: 'youda' });
    expect(handler).toBeCalledTimes(1);
    listener.unsubscribe();
    emitter.emit(undefined);
    expect(handler).toBeCalledTimes(1);
  });

  it('subscribes to key with namespaces', () => {
    const emitter = EventEmitterSelective<void>();
    const handler = jest.fn();
    const listener = emitter.listenSome(handler);

    listener.subscribeToKey({ key: 'test', ns: 'common' });
    listener.subscribeToKey({ key: 'abcd', ns: ['test', 'abcd'] });

    emitter.emit(undefined, { key: 'youda', ns: ['common'] });
    emitter.emit(undefined, { key: 'test', ns: ['youda'] });
    expect(handler).toBeCalledTimes(0);
    emitter.emit(undefined, { key: 'abcd', ns: ['abcd'] });
    emitter.emit(undefined, { ns: ['test'] });
    expect(handler).toBeCalledTimes(2);
    listener.unsubscribe();
    emitter.emit(undefined);
    expect(handler).toBeCalledTimes(2);
  });

  it('unsubscribes', () => {
    const emitter = EventEmitterSelective<void>();
    const handler = jest.fn();
    const listener = emitter.listenSome(handler);

    listener.subscribeToKey({ key: 'test', ns: 'common' });
    listener.subscribeToKey({ key: 'abcd', ns: ['test', 'abcd'] });

    emitter.emit(undefined, { key: 'youda', ns: ['common'] });
    emitter.emit(undefined, { key: 'test', ns: ['youda'] });
    expect(handler).toBeCalledTimes(0);
    emitter.emit(undefined, { key: 'abcd', ns: ['abcd'] });
    emitter.emit(undefined, { ns: ['test'] });
    expect(handler).toBeCalledTimes(2);

    listener.unsubscribeKey({ key: 'abcd', ns: ['test', 'abcd'] });
    emitter.emit(undefined, { key: 'abcd' });
    emitter.emit(undefined, { ns: ['test'] });

    listener.unsubscribe();
    emitter.emit(undefined);
    expect(handler).toBeCalledTimes(2);
  });
});
