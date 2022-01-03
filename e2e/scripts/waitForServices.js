const { spawn } = require('child_process');
const { exit } = require('process');

const PATTERNS = ['Tomcat started on port(s):'];

const ls = spawn('docker', ['compose', 'logs', '-f']);

let remainingPatterns = [...PATTERNS];

ls.stdout.on('data', function (data) {
  const text = data.toString();
  process.stdout.write(text);

  remainingPatterns = remainingPatterns.filter((pattern) => {
    return !text.includes(pattern);
  });

  if (!remainingPatterns.length) {
    console.log('success');
    exit(0);
  }
});

ls.stderr.on('data', function (data) {
  process.stdout.write(data.toString());
});

ls.on('exit', function (code) {
  process.stdout.write('child process exited with code ' + code.toString());
});

setTimeout(() => {
  console.log('timeout');
  exit(1);
}, 120_000);
