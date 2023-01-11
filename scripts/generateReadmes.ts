import nunjucks from 'nunjucks';
import glob from 'glob';
import fs from 'fs';
import path from 'path';

glob('**/README.njk.md', { root: `${__dirname}/../packages` }, (er, files) => {
  files.forEach(async (file) => {
    if (file.includes('node_modules')) {
      return;
    }

    const dirName = path.dirname(file);
    const packagejson = JSON.parse(
      fs.readFileSync(dirName + '/package.json').toString()
    );

    const variables = {
      packageName: packagejson.name,
      urlEncodedPackageName: encodeURIComponent(packagejson.name),
    };

    const rendered = `<!-- This file was generated using pnpm generate-readmes script 
        
        Don't edit this file. Edit the README.md.njk. Macros can be found in readmeMacros/macros.njk
        
        -->${nunjucks.render(file, variables)}`;
    fs.writeFileSync(dirName + '/README.md', rendered);
  });
});
