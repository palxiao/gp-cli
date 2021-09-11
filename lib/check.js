#!/usr/bin/env node

const exec = require('child_process').exec

function checkStatus() {
  return new Promise((resolve) => {
    exec(`git status`, (error, stdout, stderr) => {
      const temp = stdout.split('\n').filter((x) => x != '')
      if (temp[temp.length - 1] === 'nothing to commit, working tree clean') {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

module.exports = { checkStatus }
