import { EventEmitterSelective } from './EventEmitterSelective';

describe('event emitter selective', () => {
  it('subscribes to key', () => {
    const emitter = EventEmitterSelective<void>();
    const handler = jest.fn();
    const listener = emitter.listenSome(handler);
    listener.subscribeKey({ key: 'test' });
    listener.subscribeKey({ key: 'abcd' });

    emitter.emit({ key: 'test' });
    emitter.emit({ key: 'youda' });
    expect(handler).toBeCalledTimes(1);
    listener.unsubscribe();
    emitter.emit();
    expect(handler).toBeCalledTimes(1);
  });

  it('subscribes to key with namespaces', () => {
    const emitter = EventEmitterSelective<void>();
    const handler = jest.fn();
    const listener = emitter.listenSome(handler);

    listener.subscribeKey({ key: 'test', ns: 'common' });
    listener.subscribeKey({ key: 'abcd', ns: ['test', 'abcd'] });

    emitter.emit({ key: 'youda', ns: ['common'] });
    emitter.emit({ key: 'test', ns: ['youda'] });
    expect(handler).toBeCalledTimes(0);
    emitter.emit({ key: 'abcd', ns: ['abcd'] });
    emitter.emit({ ns: ['test'] });
    expect(handler).toBeCalledTimes(2);
    listener.unsubscribe();
    emitter.emit();
    expect(handler).toBeCalledTimes(2);
  });

  it('unsubscribes', () => {
    const emitter = EventEmitterSelective<void>();
    const handler = jest.fn();
    const listener = emitter.listenSome(handler);

    listener.subscribeKey({ key: 'test', ns: 'common' });
    listener.subscribeKey({ key: 'abcd', ns: ['test', 'abcd'] });

    emitter.emit({ key: 'youda', ns: ['common'] });
    emitter.emit({ key: 'test', ns: ['youda'] });
    expect(handler).toBeCalledTimes(0);
    emitter.emit({ key: 'abcd', ns: ['abcd'] });
    emitter.emit({ ns: ['test'] });
    expect(handler).toBeCalledTimes(2);

    listener.unsubscribeKey({ key: 'abcd', ns: ['test', 'abcd'] });
    emitter.emit({ key: 'abcd' });
    emitter.emit({ ns: ['test'] });

    listener.unsubscribe();
    emitter.emit();
    expect(handler).toBeCalledTimes(2);
  });

  it('groups events correctly', async () => {
    const emitter = EventEmitterSelective<void>();
    const handler = jest.fn();
    const hanlderAll = jest.fn();
    const listener = emitter.listenSome(handler);
    const listenerAll = emitter.listen(hanlderAll);

    listener.subscribeKey({ key: 'abcd', ns: ['test', 'abcd'] });

    emitter.emit({ key: 'abcd' }, true);
    emitter.emit({ ns: ['opqrst'] }, true);

    await Promise.resolve();

    expect(hanlderAll).toBeCalledTimes(1);
    expect(handler).toBeCalledTimes(1);

    emitter.emit({ key: 'youda', ns: ['test'] }, true);
    emitter.emit({ key: 'filda', ns: ['test'] });

    expect(hanlderAll).toBeCalledTimes(2);
    expect(handler).toBeCalledTimes(1);

    listener.unsubscribe();
    listenerAll.unsubscribe();
    emitter.emit();
  });

  it('subscribes to ns only', async () => {
    const emitter = EventEmitterSelective<void>();
    const handler = jest.fn();
    const listener = emitter.listenSome(handler);
    listener.subscribeNs(['test']);

    emitter.emit({ key: 'youda' });
    expect(handler).toBeCalledTimes(1);

    emitter.emit({ ns: ['test'] });
    expect(handler).toBeCalledTimes(2);

    emitter.emit({ ns: ['youda'] });
    expect(handler).toBeCalledTimes(2);

    emitter.emit({ key: 'youda', ns: ['youda'] });
    expect(handler).toBeCalledTimes(2);
  });
});
