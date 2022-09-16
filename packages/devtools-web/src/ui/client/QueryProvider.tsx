import React from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';

export type GlobalOptions = {
  apiKey: string;
  apiUrl: string;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      cacheTime: 0,
      staleTime: 0,
    },
  },
});

export const QueryContext = React.createContext({} as GlobalOptions);

type Props = {
  apiKey: string;
  apiUrl: string;
};

export const QueryProvider: React.FC<Props> = ({
  children,
  apiUrl,
  apiKey,
}) => {
  return (
    <QueryContext.Provider value={{ apiUrl, apiKey }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryContext.Provider>
  );
};
