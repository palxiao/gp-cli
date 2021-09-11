#!/usr/bin/env node

const mfs = require('./utils/fs')
// const exec = require('child_process').exec
const Prompt = require('inquirer')
const run = require('../lib/run')

const select = (name, message, list) => [
  {
    type: 'list',
    name,
    message,
    choices: list,
  },
]

async function list() {
  const fileList = await mfs.fileDisplay('task')
  let selectList = []
  for (const iterator of fileList) {
    if (iterator.split('.').pop().toLowerCase() === 'json') {
      const arr = iterator.split('.')
      arr.pop()
      selectList.push(arr + '')
    }
  }
  if (selectList.length > 0) {
    const { task } = await Prompt.prompt(select('task', '请选择任务', selectList))
    run(task)
    // exec(`gp-cli run -t ${task}`, (error, stdout, stderr) => {
    //   console.log(stdout)
    //   console.log(stderr)
    // })
  }
}

module.exports = list
