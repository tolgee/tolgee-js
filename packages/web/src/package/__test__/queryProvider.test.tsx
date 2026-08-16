import { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import {
  GlobalOptions,
  QueryContext,
  QueryProvider,
} from '../ui/client/QueryProvider';

describe('QueryProvider auth wiring', () => {
  it('threads authToken from props into the QueryContext the client reads', () => {
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
        <QueryProvider apiUrl="http://x" projectId={1} authToken="jwt">
          <Consumer />
        </QueryProvider>
      );
    });

    expect(captured?.authToken).toEqual('jwt');
    expect(captured?.apiUrl).toEqual('http://x');
    act(() => root.unmount());
  });
});
