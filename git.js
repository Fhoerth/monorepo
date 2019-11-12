const childProcess = require('child_process');

const { exec } = childProcess;

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.toString().replace('\n', '').trim(''));
      }
    })
  })
}

if (false) {

// The Parent!!
runCommand('./parent.sh').then((result) => {
  console.log('RE SULT', [result]);
});

// The current !!
runCommand("git branch | grep \\* | cut -d ' ' -f2").then((result) => {
  console.log('The current', [result], result.length);
});


// Diff (unstaged work)!!
runCommand ('git diff').then((result) => {
  console.log('DIF', result.length);
}).catch((error) => {
  console.log('ERROR');
  console.log(error);
})

// Diff cached (changes to be commited)
runCommand('git diff --cached').then((result) => {
  console.log('DIF CACHED', result.length);
});

// has new files
runCommand('git ls-files . --exclude-standard --others').then((result) => {
  console.log('Has new files', result.length);
});

}

// EXISTS REMOTE BRANCH?
runCommand('git ls-remote --heads --exit-code origin "$(git symbolic-ref --short HEAD)"').then((result) => {
  console.log('Res', '@@@@@', result);
}).catch((error) => {
  console.log('No existe...');
})

// has un-pushed commits.

// runCommand('git status').then((result) => {
//   console.log('Status', result.length);
// }).catch((error) => {
//   console.log('ERROR');
//   console.log(error);
// })