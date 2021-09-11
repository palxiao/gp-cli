#!/usr/bin/env node
const program = require('commander')

const packageJson = require('../package.json')
program.version(packageJson.version)

const init = require('../lib/init')
const list = require('../lib/list')
const run = require('../lib/run')
const turnVersion = require('../lib/turnVersion.js')

program
  .command('create <name>')
  .alias('c')
  .description('规则生成器')
  .action((name) => {
    console.log('创建任务: '+name + ' ...')
    init(name)
  })

program
  .command('run')
  .alias('r')
  .description('规则运行器')
  .action(async () => {
    // console.log(program.opts())
    if (program.opts().task) {
      run(program.opts().task)
    } else if (program.opts().rolling) {
      turnVersion()
    } else {
      console.log('?.? 没有可以运行的任务')
    }
  })

program
  .command('list')
  .alias('l')
  .description('查看任务列表，点击后运行')
  .action(() => {
    // console.log(program.opts())
    list()
  })
  

program.option('-t, --task <name>', '配置任务名称', '').option('-r, --rolling', '自动更迭版本号', '')

program.parse(process.argv)
