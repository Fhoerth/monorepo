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

const getCurrentBranchName = () => runCommand("git branch | grep \\* | cut -d ' ' -f2");

if (false) {

// The Parent!!
runCommand('./parent.sh').then((result) => {
  console.log('RE SULT', [result]);
});

// The current !!
getCurrentBranchName().then((result) => {
  console.log('The current', [result], result.length);
});


// has new files

}

// Diff (unstaged work)!!
runCommand ('git diff').then((result) => {
  console.log('Has UnStagedWork?', !!result.length);
}).catch((error) => {
  console.log('UnstagdWorkError', error);
});

// Diff cached (changes to be commited)
runCommand('git diff --cached').then((result) => {
  console.log('has CachedUnstagedWork?', !!result.length);
}).catch((error) => {
  console.log('CachedUnstagedWorkError', error);
});

// Has new files?
runCommand('git ls-files . --exclude-standard --others').then((result) => {
  console.log('Has new files?', !!result.length);
});

// Has unpushed commits? (only if remote branch exists)
const hasUnpushedCommits = () => getCurrentBranchName().then(currentBranch => {
  // has un-pushed commits with the remote branch?
  return runCommand(`git log origin/${currentBranch}...HEAD`).then((changes) => {
    return !!changes.length;
  })
});

  
// Does remote branch exists?
const remoteBranchExists = () => getCurrentBranchName().then((branchName) => (
  runCommand(`git ls-remote --heads origin ${branchName}`)
)).then((output) => !!output.length);

remoteBranchExists().then((exists) => {
  console.log('Branch exists?', exists);

  if (exists) {
    hasUnpushedCommits().then((result) => {
      console.log('Has UnPushedCommits?', result);
    })
  }
})





// has un-pushed commits.

// runCommand('git status').then((result) => {
//   console.log('Status', result.length);
// }).catch((error) => {
//   console.log('ERROR');
//   console.log(error);
// })