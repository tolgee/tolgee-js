import fetchMock from 'jest-fetch-mock';
import { getMocker } from './mockData';

export const mockCoreFetch = () => {
  const asyncFetchResult = mockCoreFetchAsync();
  asyncFetchResult.resolveAll();
  return asyncFetchResult.fetch;
};

export const mockCoreFetchAsync = () => {
  const mocker = getMocker();

  const fetch = fetchMock.mockResponse((req) => {
    return mocker.getDataForUrl(req.url);
  });

  return { ...mocker.mockData, fetch, resolveAll: mocker.resolveAll };
};
