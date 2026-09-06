import { createContext } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import type { DevApiTransport } from '@tolgee/core';

export type GlobalOptions = {
  apiKey?: string;
  apiUrl: string;
  projectId: string | number | undefined;
  branch?: string;
  transport?: DevApiTransport;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

export const QueryContext = createContext({} as GlobalOptions);

type Props = GlobalOptions;

export const QueryProvider = ({
  children,
  apiUrl,
  apiKey,
  projectId,
  branch,
  transport,
}: React.PropsWithChildren<Props>) => {
  return (
    <QueryContext.Provider
      value={{ apiUrl, apiKey, projectId, branch, transport }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryContext.Provider>
  );
};
