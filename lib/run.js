#!/usr/bin/env node
const exec = require('child_process').exec
const mfs = require('./utils/fs')
const check = require('./check')
const open = require('open')
const ora = require('ora')

// const Prompt = require('inquirer')
const template = require('../bash/template')
const template_build = require('../bash/template_build')

async function run(taskName) {
  const process = ora()
  process.start('执行发布中...')

  // let bash = await mfs.readFile(template)
  // let build_shell = await mfs.readFile(template_build)
  let bash = template
  let build_shell = template_build
  let json = await mfs.readFile(`task/${taskName}.json`)
  json = JSON.parse(json.toString())

  const { develop, publish, depend, build, prLink } = json

  bash = bash.replace(new RegExp(`#{develop}`, 'gm'), develop)
  bash = bash.replace(new RegExp(`#{publish}`, 'gm'), publish)
  bash = bash.replace(new RegExp(`#{depend}`, 'gm'), depend)

  const merge = develop === publish ? `git merge ${depend}` : `git merge ${depend} && git merge ${develop}`
  bash = bash.replace(new RegExp(`#{merge}`, 'gm'), merge)

  build_shell = build ? build_shell.replace(new RegExp(`#{build_shell}`, 'gm'), build) : ''
  bash = bash.replace(new RegExp(`#{build}`, 'gm'), build_shell)

  bash = bash.replace(new RegExp(`#{taskName}`, 'gm'), taskName)

  const isStatusPass = await check.checkStatus()
  if (!isStatusPass) {
    process.fail('开发分支下有未提交代码，不建议继续操作')
    return
  }

  await mfs.writeFile(`task/${taskName}`, bash)

  exec(`sh task/${taskName}`, (error, stdout, stderr) => {
    console.log(stdout)
    console.log(stderr)
    if (!error) {
      process.succeed('发布成功，准备前往合并分支')
      setTimeout(() => {
        open(`${prLink}/compare/${depend}...${publish}`)
      }, 1200);
    }
  })
}

module.exports = run
