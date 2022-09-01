import { BackendPlugin } from '../types';

export const TolgeeBackend: BackendPlugin = ({ apiUrl, apiKey }) => ({
  isDev: true,
  getRecord({ language, namespace }) {
    if (namespace) {
      return undefined;
    }
    return fetch(`${apiUrl}/v2/projects/translations/${language}`, {
      headers: { 'X-API-Key': apiKey || '' },
    }).then((r) => {
      if (r.ok) {
        return r.json().then((data) => data[language]);
      } else {
        throw new Error(r.statusText);
      }
    });
  },
});
