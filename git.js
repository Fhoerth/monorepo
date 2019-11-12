const childProcess = require('child_process');

const { exec } = childProcess;

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.toString());
      }
    })
  })
}

// The Parent!!
runCommand('./parent.sh').then((result) => {
  console.log(result.replace('\n', '').trim(''));
});

// Diff!!
runCommand  ('git diff').then((result) => {
  console.log('DIF', result.length);
});

runCommand('git status').then((result) => {
  console.log('Status', result.length);
}).catch((error) => {
  console.log(error);
})