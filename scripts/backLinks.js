const fs = require('fs');
const path = require('path');

const linkReact = (app) => {
  const target = path.join('packages/react/node_modules/react');
  const locationDir = path.join('testapps', app, 'node_modules');
  const location = path.join(locationDir, 'react');

  fs.rmSync(location, { recursive: true, force: true });
  fs.symlinkSync(path.relative(locationDir, target), location);
};

linkReact('react');
linkReact('next');
linkReact('gatsby');
linkReact('next-internal');

const linkVue = (app) => {
  const target = path.join('packages/vue/node_modules/vue');
  const locationDir = path.join('testapps', app, 'node_modules');
  const location = path.join(locationDir, 'vue');

  fs.rmSync(location, { recursive: true, force: true });
  fs.symlinkSync(path.relative(locationDir, target), location);
};

linkVue('vue');
