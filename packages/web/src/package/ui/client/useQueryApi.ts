import { RequestOptions } from 'https';
import { useCallback, useContext } from 'react';
import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
  useMutation,
  Query,
  QueryClient,
  UseMutationOptions,
  MutationOptions,
} from 'react-query';
import { paths } from './apiSchema.generated';
import { client } from './client';
import { QueryContext } from './QueryProvider';
import { RequestParamsType, ResponseContent } from './types';
import { HttpError } from './HttpError';

export type QueryProps<
  Url extends keyof Paths,
  Method extends keyof Paths[Url],
  Paths = paths,
> = {
  url: Url;
  method: Method;
  fetchOptions?: RequestOptions;
  options?: UseQueryOptions<ResponseContent<Url, Method, Paths>>;
} & RequestParamsType<Url, Method, Paths>;

export const useApiQuery = <
  Url extends keyof Paths,
  Method extends keyof Paths[Url],
  Paths = paths,
>(
  props: QueryProps<Url, Method, Paths>
) => {
  const { url, method, options, ...request } = props;

  const globalOptions = useContext(QueryContext);

  return useQuery<ResponseContent<Url, Method, Paths>, HttpError>(
    [url, (request as any)?.path, (request as any)?.query],
    () => client(url, method, request as any, globalOptions),
    options
  );
};

export type MutationProps<
  Url extends keyof Paths,
  Method extends keyof Paths[Url],
  Paths = paths,
> = {
  url: Url;
  method: Method;
  fetchOptions?: RequestOptions;
  options?: UseMutationOptions<
    ResponseContent<Url, Method, Paths>,
    any,
    RequestParamsType<Url, Method, Paths>
  >;
  invalidatePrefix?: string;
};

export const useApiMutation = <
  Url extends keyof Paths,
  Method extends keyof Paths[Url],
  Paths = paths,
>(
  props: MutationProps<Url, Method, Paths>
) => {
  const queryClient = useQueryClient();
  const { url, method, options, invalidatePrefix } = props;
  const globalOptions = useContext(QueryContext);
  const mutation = useMutation<
    ResponseContent<Url, Method, Paths>,
    HttpError,
    RequestParamsType<Url, Method, Paths>
  >(
    (request) =>
      client<Url, Method, Paths>(url, method, request, globalOptions),
    options
  );

  // inject custom onSuccess
  const customOptions = (options: MutationOptions<any, any, any, any>) => ({
    ...options,
    onSuccess: (...args: any) => {
      if (invalidatePrefix !== undefined) {
        invalidateUrlPrefix(queryClient, invalidatePrefix);
      }
      // @ts-ignore
      options?.onSuccess?.(...args);
    },
  });

  const mutate = useCallback<typeof mutation.mutate>(
    (variables, options) => {
      return mutation.mutate(variables, customOptions(options as any));
    },
    [mutation.mutate]
  );

  const mutateAsync = useCallback<typeof mutation.mutateAsync>(
    (variables, options) => {
      return mutation.mutateAsync(variables, customOptions(options as any));
    },
    [mutation.mutateAsync]
  );

  return { ...mutation, mutate, mutateAsync };
};

export const matchUrlPrefix = (prefix: string) => {
  return {
    predicate: (query: Query) => {
      return (query.queryKey[0] as string)?.startsWith(prefix);
    },
  };
};

export const invalidateUrlPrefix = (queryClient: QueryClient, prefix: string) =>
  queryClient.invalidateQueries(matchUrlPrefix(prefix));
