import { Config } from './types';
import path from 'path';

export const config: Config = {
  dockerComposeServices: {
    app: {
      waitForOutput: 'Tomcat started on port(s): 8080 (http)',
    },
  },
  tests: {
    react: {
      commandLineServices: {
        dev: {
          command: 'npm run develop',
          cwd: path.resolve(__dirname, '../../testapps/react/'),
          environment: {
            REACT_APP_TOLGEE_API_URL: 'http://localhost:8202',
            REACT_APP_TOLGEE_API_KEY:
              'examples-admin-imported-project-implicit',
            BROWSER: 'none',
            PORT: '8113',
          },
          waitForOutput: /http:\/\/localhost:.*8113/gm,
        },
        prod: {
          cwd: path.resolve(__dirname, '../../testapps/react/'),
          command: 'npm run serve -- -p 8102',
          waitForOutput: 'INFO: Accepting connections at http://localhost:8102',
        },
      },
    },
    web: {
      commandLineServices: {
        core: {
          command: 'npm run serve',
          cwd: path.resolve(__dirname, '../../testapps/web/'),
          waitForOutput: 'INFO: Accepting connections',
        },
      },
    },
    gatsby: {
      commandLineServices: {
        dev: {
          command: 'npm run start -- --host=0.0.0.0 -p 8104',
          cwd: path.resolve(__dirname, '../../testapps/gatsby/'),
          environment: {
            GATSBY_TOLGEE_API_URL: 'http://localhost:8202',
            GATSBY_TOLGEE_API_KEY: 'examples-admin-imported-project-implicit',
          },
          waitForOutput: /success Building/g,
        },
        prod: {
          cwd: path.resolve(__dirname, '../../testapps/gatsby/'),
          command: 'npm run serve -- --host=0.0.0.0 -p 8105',
          waitForOutput: /Local:.*http:\/\/localhost/g,
        },
      },
      dockerComposeServices: {},
    },
    next: {
      commandLineServices: {
        prod: {
          command: 'npm run start -- -p 8107',
          cwd: path.resolve(__dirname, '../../testapps/next/'),
          waitForOutput: 'on 0.0.0.0:8107',
        },
        dev: {
          command: 'npm run dev -- -p 8106',
          cwd: path.resolve(__dirname, '../../testapps/next/'),
          waitForOutput: 'client and server successfully',
          environment: {
            NEXT_BUILD_DIR: 'dist-e2e',
            NEXT_PUBLIC_TOLGEE_API_URL: 'http://localhost:8202',
            NEXT_PUBLIC_TOLGEE_API_KEY:
              'examples-admin-imported-project-implicit',
          },
        },
      },
    },
    'next-internal': {
      commandLineServices: {
        dev: {
          command: 'npm run dev -- -p 8114',
          cwd: path.resolve(__dirname, '../../testapps/next-internal/'),
          waitForOutput: 'client and server successfully',
          environment: {
            NEXT_PUBLIC_TOLGEE_API_URL: 'http://localhost:8202',
          },
        },
      },
    },
    svelte: {
      commandLineServices: {
        dev: {
          command: 'npm run dev:e2e',
          cwd: path.resolve(__dirname, '../../testapps/svelte/'),
          waitForOutput: 'ready in',
          environment: {
            VITE_TOLGEE_API_URL: 'http://localhost:8202',
            VITE_TOLGEE_API_KEY: 'examples-admin-imported-project-implicit',
          },
        },
        prod: {
          command: 'npm run serve -- -p 8109',
          cwd: path.resolve(__dirname, '../../testapps/svelte/'),
          waitForOutput: 'Accepting connections at',
        },
      },
    },
    vue: {
      commandLineServices: {
        dev: {
          command: 'npm run develop -- --port 8112',
          cwd: path.resolve(__dirname, '../../testapps/vue/'),
          waitForOutput: 'App running at',
          environment: {
            VUE_APP_TOLGEE_API_URL: 'http://localhost:8202',
            VUE_APP_TOLGEE_API_KEY: 'examples-admin-imported-project-implicit',
          },
          stdErrEnabled: false,
        },
        prod: {
          command: 'npm run serve -- -p 8111',
          cwd: path.resolve(__dirname, '../../testapps/vue/'),
          waitForOutput: 'Accepting connections at',
        },
      },
    },
    ngx: {
      commandLineServices: {
        dev: {
          command: 'npm run startE2e -- --port 8116',
          cwd: path.resolve(__dirname, '../../testapps/ngx/'),
          waitForOutput: 'Compiled successfully.',
        },
        prod: {
          command: 'npm run serve -- -p 8115',
          cwd: path.resolve(__dirname, '../../testapps/ngx/'),
          waitForOutput: 'Accepting connections at',
        },
      },
    },
    'react-i18next': {
      commandLineServices: {
        dev: {
          command: 'npm run develop',
          cwd: path.resolve(__dirname, '../../testapps/react-i18next/'),
          environment: {
            REACT_APP_TOLGEE_API_URL: 'http://localhost:8202',
            REACT_APP_TOLGEE_API_KEY:
              'examples-admin-imported-project-implicit',
            BROWSER: 'none',
            PORT: '8118',
          },
          waitForOutput: /http:\/\/localhost:.*8118/gm,
        },
        prod: {
          cwd: path.resolve(__dirname, '../../testapps/react-i18next/'),
          command: 'npm run serve -- -p 8117',
          waitForOutput: 'INFO',
        },
      },
    },
    'vue-i18next': {
      commandLineServices: {
        dev: {
          command: 'npm run develop -- --port 8120',
          cwd: path.resolve(__dirname, '../../testapps/vue-i18next/'),
          waitForOutput: 'App running at',
          environment: {
            VUE_APP_TOLGEE_API_URL: 'http://localhost:8202',
            VUE_APP_TOLGEE_API_KEY: 'examples-admin-imported-project-implicit',
          },
          stdErrEnabled: false,
        },
        prod: {
          command: 'npm run serve -- -p 8119',
          cwd: path.resolve(__dirname, '../../testapps/vue-i18next/'),
          waitForOutput: 'Accepting connections at',
        },
      },
    },
  },
};
