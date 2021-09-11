#!/usr/bin/env node

const mfs = require('./utils/fs')
const exec = require('child_process').exec
const Prompt = require('inquirer')

const select = (name, message, list) => [
  {
    type: 'list',
    name,
    message,
    choices: list,
  },
]

const inputQuestion = (name, message) => [
  {
    type: 'input',
    message,
    name,
    default: '', // 默认值
  },
]

async function init(name) {
  const gitignore = await mfs.readFile('.gitignore')
  if (gitignore.indexOf('task/') < 0) {
    mfs.writeFile('.gitignore', gitignore + '\ntask/')
  }

  exec('git branch', async (error, stdout, stderr) => {
    let content = stdout.replace('*', ' ')
    content = content.replace(new RegExp('  ', 'gm'), '')
    content = content.replace(new RegExp('\n', 'gm'), ',').substr(0, content.length - 1)

    const { develop } = await Prompt.prompt(select('develop', '你的开发分支是', content.split(',')))
    const { publish } = await Prompt.prompt(select('publish', '发布分支是', content.split(',')))
    const { depend } = await Prompt.prompt(select('depend', '发布分支所依赖的分支是', content.split(',')))
    const { build } = await Prompt.prompt(inputQuestion('build', '创建编译命令(非必填)'))
    const { prLink } = await Prompt.prompt(inputQuestion('prLink', '输入项目链接'))
    const obj = { develop, publish, depend, build, prLink }

    await mfs.fileDisplay('task')
    mfs.writeFile(`task/${name}.json`, JSON.stringify(obj))
  })

  // exec('git config --global user.name', (error, stdout, stderr) => {
  //   console.log(stdout);
  //   exec('git config --global user.email', (error, stdout, stderr) => {
  //     console.log(stdout);
  //   })
  // })
}

module.exports = init
