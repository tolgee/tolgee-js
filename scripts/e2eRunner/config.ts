import { Config } from './types';
import path from 'path';

export const config: Config = {
  dockerComposeServices: {
    app: {
      waitForOutput: 'Tomcat started on port 8080',
    },
  },
  tests: {
    react: {
      commandLineServices: {
        dev: {
          command: 'npm run develop -- --port 8113',
          cwd: path.resolve(__dirname, '../../testapps/react/'),
          environment: {
            VITE_APP_TOLGEE_API_URL: 'http://localhost:8202',
            VITE_APP_TOLGEE_API_KEY: 'examples-admin-imported-project-implicit',
          },
        },
        prod: {
          cwd: path.resolve(__dirname, '../../testapps/react/'),
          command: 'npm run preview -- --port 8102',
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
    next: {
      commandLineServices: {
        prod: {
          command: 'npm run start -- -p 8107',
          cwd: path.resolve(__dirname, '../../testapps/next/'),
          waitForOutput: 'Ready in ',
        },
        dev: {
          command: 'npm run dev -- -p 8106',
          cwd: path.resolve(__dirname, '../../testapps/next/'),
          waitForOutput: 'Ready in ',
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
          waitForOutput: 'Ready in ',
          environment: {
            NEXT_PUBLIC_TOLGEE_API_URL: 'http://localhost:8202',
          },
        },
      },
    },
    svelte: {
      commandLineServices: {
        dev: {
          command: 'npm run develop -- --port 8110',
          cwd: path.resolve(__dirname, '../../testapps/svelte/'),
          environment: {
            VITE_TOLGEE_API_URL: 'http://localhost:8202',
            VITE_TOLGEE_API_KEY: 'examples-admin-imported-project-implicit',
          },
        },
        prod: {
          command: 'npm run preview -- --port 8109',
          cwd: path.resolve(__dirname, '../../testapps/svelte/'),
        },
      },
    },
    vue: {
      commandLineServices: {
        dev: {
          command: 'npm run develop -- --port 8112',
          cwd: path.resolve(__dirname, '../../testapps/vue/'),
          environment: {
            VITE_TOLGEE_API_URL: 'http://localhost:8202',
            VITE_TOLGEE_API_KEY: 'examples-admin-imported-project-implicit',
          },
          stdErrEnabled: false,
        },
        prod: {
          command: 'npm run preview -- --port 8111',
          cwd: path.resolve(__dirname, '../../testapps/vue/'),
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
          command: 'npm run develop -- --port 8118',
          cwd: path.resolve(__dirname, '../../testapps/react-i18next/'),
          environment: {
            VITE_APP_TOLGEE_API_URL: 'http://localhost:8202',
            VITE_APP_TOLGEE_API_KEY: 'examples-admin-imported-project-implicit',
          },
        },
        prod: {
          cwd: path.resolve(__dirname, '../../testapps/react-i18next/'),
          command: 'npm run preview -- --port 8117',
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
    'next-app': {
      commandLineServices: {
        prod: {
          command: 'npm run start -- -p 8121',
          cwd: path.resolve(__dirname, '../../testapps/next-app/'),
          waitForOutput: 'Ready in ',
        },
        dev: {
          command: 'npm run dev -- -p 8122',
          cwd: path.resolve(__dirname, '../../testapps/next-app/'),
          waitForOutput: 'Ready in ',
          environment: {
            NEXT_BUILD_DIR: 'dist-e2e',
            NEXT_PUBLIC_TOLGEE_API_URL: 'http://localhost:8202',
            NEXT_PUBLIC_TOLGEE_API_KEY:
              'examples-admin-imported-project-implicit',
          },
        },
      },
    },
  },
};
