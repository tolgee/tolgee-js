import { EventEmitterSelective } from './EventEmitterSelective';

describe('event emitter selective', () => {
  it('handles correctly default namespace', () => {
    const emitter = EventEmitterSelective(
      () => true,
      () => [],
      () => 'default'
    );
    const handler = jest.fn();
    const listener = emitter.listenSome(handler);

    // subscribe to default ns
    listener.subscribeNs();

    // emmit
    emitter.emit(['default']);
    // should be ignored
    emitter.emit(['c']);

    expect(handler).toBeCalledTimes(1);
  });

  it('unsubscribes', () => {
    const emitter = EventEmitterSelective(
      () => true,
      () => [],
      () => ''
    );
    const handler = jest.fn();
    const listener = emitter.listen(handler);

    emitter.emit();

    listener.unsubscribe();
    emitter.emit();
    expect(handler).toBeCalledTimes(1);
  });

  it('groups events correctly', async () => {
    const emitter = EventEmitterSelective(
      () => true,
      () => ['test', 'opqrst'],
      () => ''
    );
    const handler = jest.fn();
    const hanlderAll = jest.fn();
    const listener = emitter.listenSome(handler);
    const listenerAll = emitter.listen(hanlderAll);

    listener.subscribeNs('test');

    // is fallback should always call handler
    emitter.emit(['opqrst'], true);

    await new Promise((resolve) => setTimeout(resolve));

    expect(hanlderAll).toBeCalledTimes(1);
    expect(handler).toBeCalledTimes(1);

    // these should be merged together
    emitter.emit(['abcd'], true);
    emitter.emit(['abcd']);

    expect(hanlderAll).toBeCalledTimes(2);
    expect(handler).toBeCalledTimes(1);

    listener.unsubscribe();
    listenerAll.unsubscribe();
    emitter.emit();
  });

  it('always subscribes to fallback ns', async () => {
    const emitter = EventEmitterSelective(
      () => true,
      () => ['fallback1', 'fallback2'],
      () => ''
    );
    const handler = jest.fn();
    emitter.listenSome(handler);

    emitter.emit(['fallback1']);
    expect(handler).toBeCalledTimes(1);

    emitter.emit(['fallback2']);
    expect(handler).toBeCalledTimes(2);

    emitter.emit(['test']);
    expect(handler).toBeCalledTimes(2);
  });

  it('switches off emitting', () => {
    const emitter = EventEmitterSelective(
      () => false,
      () => ['fallback1', 'fallback2'],
      () => ''
    );
    const handler = jest.fn();
    emitter.listenSome(handler);

    emitter.emit(['fallback1']);
    expect(handler).toBeCalledTimes(0);

    emitter.emit(['fallback2']);
    expect(handler).toBeCalledTimes(0);

    emitter.emit(['']);
    expect(handler).toBeCalledTimes(0);
  });
});
