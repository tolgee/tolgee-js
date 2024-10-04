import 'node-fetch';
import { getMocker } from '@tolgee/testing/mockData.js';
import createFetchMock from 'vitest-fetch-mock';
import { vi } from 'vitest';

const fetchMocker = createFetchMock(vi);

export const mockCoreFetch = () => {
	const mocker = getMocker();

	const fetch = fetchMocker.mockResponse((req) => {
		return mocker.getDataForUrl(req.url);
	});

	return { ...mocker.mockData, fetch, resolveAll: mocker.resolveAll };
};
