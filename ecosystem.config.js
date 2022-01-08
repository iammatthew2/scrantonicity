/*
  prob best to not include this in the repo, but keeping this here now to keep track of it
  Launch app with: pm2 start ecosystem.config.js
*/
module.exports = {
  apps : [{
    name      : 'scrantonicity',
    cwd: '/home/pi/dev/scrantonicity',
    script    : 'yarn',
    args      : 'serve',
    interpreter: '/bin/bash',
    env: {
      NODE_ENV: 'development'
    }
  }]
};
