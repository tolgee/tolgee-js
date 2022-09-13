import { RequestOptions } from 'https';
import { useContext } from 'react';
import { UseQueryOptions, useQuery } from 'react-query';
import { paths } from './apiSchema.generated';
import { client } from './client';
import { QueryContext } from './QueryProvider';
import { RequestParamsType, ResponseContent } from './types';

export type QueryProps<
  Url extends keyof Paths,
  Method extends keyof Paths[Url],
  Paths = paths
> = {
  url: Url;
  method: Method;
  fetchOptions?: RequestOptions;
  options?: UseQueryOptions<ResponseContent<Url, Method, Paths>>;
} & RequestParamsType<Url, Method, Paths>;

export const useApiQuery = <
  Url extends keyof Paths,
  Method extends keyof Paths[Url],
  Paths = paths
>(
  props: QueryProps<Url, Method, Paths>
) => {
  const { url, method, options, ...request } = props;

  const globalOptions = useContext(QueryContext);

  return useQuery<ResponseContent<Url, Method, Paths>, any>(
    [url, (request as any)?.path, (request as any)?.query],
    () => client(url, method, request, globalOptions),
    options
  );
};
