import { createContext } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';

export type GlobalOptions = {
  apiKey: string;
  apiUrl: string;
  projectId: string | number | undefined;
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
}: React.PropsWithChildren<Props>) => {
  return (
    <QueryContext.Provider value={{ apiUrl, apiKey, projectId }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryContext.Provider>
  );
};
