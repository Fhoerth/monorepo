const fs = require('fs');
const childProcess = require('child_process');
const path = require('path');
const rimraf = require('rimraf');
const uuid = require('uuid');
const tmpDir = path.join(__dirname, `tmp_${uuid.v4()}`);

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.toString().replace('\n', '').trim(''));
      }
    })
  })
}

// First check if branch exists.

const repositoryName = 'repository';
fs.mkdirSync(tmpDir);
runCommand(`git clone git@github.com:Fhoerth/monorepo.git ${tmpDir}/${repositoryName}`)
  .then(() => {
    console.log('Done cloning');
  })
  .then(() => {
     const repoTmpDir = `repo_tmp_${uuid.v4()}`;
     const repositoryPath = path.join(tmpDir, repositoryName);
     const repositoryPackagesPath = path.join(repositoryPath, 'packages')
     const repositoryTmpPath =  path.join(repositoryPath, repoTmpDir);

     fs.mkdirSync(repositoryTmpPath);
     
     const promises = fs.readdirSync(repositoryPackagesPath).map((x) => {
       if (fs.lstatSync(path.join(repositoryPackagesPath, x)).isDirectory()) {
        const packageTmpDir = `package_tmp_${x}_${uuid.v4()}`;
        fs.mkdirSync(path.join(repositoryPath, packageTmpDir));

        return runCommand(`cd ${path.join(repositoryPath, packageTmpDir)} && git init && git remote add origin git@github.com:Fhoerth/monorepo.git`).then(() => {
        // runCommand(`cp -R ${path.join(repositoryPath, '.git')} ${path.join(repositoryPath, packageTmpDir)}`).then(() => {
          return runCommand(`cp -R ${path.join(repositoryPackagesPath, x)}/* ${path.join(repositoryPath, packageTmpDir)}`)
            .then(() => {
              return runCommand(`cd ${path.join(repositoryPath, packageTmpDir)} && git status`).then((output) => {
                const packageJson = JSON.parse(fs.readFileSync(path.join(repositoryPath, packageTmpDir, 'package.json').toString()));
                const { version } = packageJson;
                return runCommand(`cd ${path.join(repositoryPath, packageTmpDir)} && git checkout -b release__${x} && git add . && git commit -m 'Release ${version}' && git push origin release__${x}`).then(() => {
                  console.log('Done', x);
                })
              })
            })
        });
       }

       return Promise.resolve(null);
     });

     return Promise.all(promises);
     
    // List all packages from repositoryPath.

    // 
    //  return runCommand(`mv ${path.join(tmpDir, repositoryName)} * ${repoTmpDir}`);
  }).then(() => {
    rimraf.sync(tmpDir);
  })
  // .then(() => {
  //   childProcess.exec(, (err, stdout) => {
  //     console.log('stdouit', err, stdout);
  //   });
  // })
  // .then(() => {
  //   return runCommand('cd ..');
  // })
  // .then(() => {
  //   // fs.rmdirSync(tmpDir);
  // })
  // .catch(() => {
  //   // fs.rmdirSync(tmpDir);
  // })
