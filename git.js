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

runCommand('git status').then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error);
})