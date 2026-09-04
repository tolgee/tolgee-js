import { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import {
  GlobalOptions,
  QueryContext,
  QueryProvider,
} from '../ui/client/QueryProvider';

describe('QueryProvider auth wiring', () => {
  it('threads the transport from props into the QueryContext the client reads', () => {
    const transport = jest.fn();
    let captured: GlobalOptions | undefined;
    const Consumer = () => {
      captured = useContext(QueryContext);
      return null;
    };

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
      root.render(
        <QueryProvider apiUrl="http://x" projectId={1} transport={transport}>
          <Consumer />
        </QueryProvider>
      );
    });

    expect(captured?.transport).toBe(transport);
    expect(captured?.apiUrl).toEqual('http://x');
    expect(captured?.apiKey).toBeUndefined();
    act(() => root.unmount());
  });
});
