import { Controller } from '../Controller/Controller';

describe('required namespaces', () => {
  it('<default>', () => {
    const controller = Controller({
      options: {},
    });
    expect(controller.getDefaultNs()).toEqual('');
    expect(controller.getRequiredNamespaces()).toEqual(['']);
  });

  it('ns:[common]', () => {
    const controller = Controller({
      options: { ns: ['common'] },
    });
    expect(controller.getRequiredNamespaces()).toEqual(['common']);
    expect(controller.getDefaultNs()).toEqual('common');
  });

  it('defaultNs: test', () => {
    const controller = Controller({
      options: { defaultNs: 'test' },
    });
    expect(controller.getRequiredNamespaces()).toEqual(['test']);
    expect(controller.getDefaultNs()).toEqual('test');
  });

  it('defaultNs: test, ns:[common]', () => {
    const controller = Controller({
      options: { defaultNs: 'test', ns: ['common'] },
    });
    expect(controller.getRequiredNamespaces()).toEqual(['test', 'common']);
    expect(controller.getDefaultNs()).toEqual('test');
  });

  it('defaultNs, ns, fallbackNs', () => {
    const controller = Controller({
      options: {
        defaultNs: 'test',
        ns: ['common', 'test2'],
        fallbackNs: ['fallback', 'fallback2'],
      },
    });
    expect(controller.getRequiredNamespaces()).toEqual([
      'test',
      'common',
      'test2',
      'fallback',
      'fallback2',
    ]);
  });
});
