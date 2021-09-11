var fs = require('fs')
var path = require('path')

function copyFile(src, dist) {
  fs.writeFileSync(dist, fs.readFileSync(src))
}
/**
 * 用流的方式复制文件
 */
// function copyFile(beginPath, endPath) {
//     const readStream = fs.createReadStream(beginPath);
//     const writeStream = fs.createWriteStream(endPath);
//     readStream.pipe(writeStream);
// }

function removeFile(src) {
  fs.unlinkSync(src)
}

function copyDir(src, dist, callback) {
  fs.access(dist, function (err) {
    if (err) {
      // 目录不存在时创建目录
      fs.mkdirSync(dist)
    }
    _copy(null, src, dist)
  })

  function _copy(err, src, dist) {
    if (err) {
      callback(err)
    } else {
      fs.readdir(src, function (err, paths) {
        if (err) {
          callback(err)
        } else {
          paths.forEach(function (path) {
            var _src = src + '/' + path
            var _dist = dist + '/' + path
            fs.stat(_src, function (err, stat) {
              if (err) {
                callback(err)
              } else {
                // 判断是文件还是目录
                if (stat.isFile()) {
                  fs.writeFileSync(_dist, fs.readFileSync(_src))
                } else if (stat.isDirectory()) {
                  // 当是目录是，递归复制
                  copyDir(_src, _dist, callback)
                }
              }
            })
          })
        }
      })
    }
  }
}

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
  return new Promise((resolve) => {
    fs.mkdir(filePath, function (error) {
      const fileList = []
      eachFiles(filePath)
      function eachFiles(filePath) {
        fs.readdir(filePath, function (err, files) {
          if (err) {
            // console.warn(' TvT ... 请确定是否创建 task 目录')
          } else {
            //遍历读取到的文件列表
            files.forEach(function (filename) {
              fileList.push(filename)
              //获取当前文件的绝对路径
              // var filedir = path.join(filePath, filename)
              // //根据文件路径获取文件信息，返回一个fs.Stats对象
              // fs.stat(filedir, function (eror, stats) {
              //   if (eror) {
              //     console.warn('获取文件stats失败')
              //   } else {
              //     var isFile = stats.isFile() //是文件
              //     var isDir = stats.isDirectory() //是文件夹
              //     if (isFile) {
              //       fileList.push(filedir)
              //     }
              //     if (isDir) {
              //       eachFiles(filedir) //递归，如果是文件夹，就继续遍历该文件夹下面的文件
              //     }
              //   }
              // })
            })
            resolve(fileList)
          }
        })
      }
    })
  })
}

/**
 * 读取文件
 */
function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve(data)
    })
  })
}
/**
 * 写入文件
 */
function writeFile(path, context) {
  return new Promise((resolve) => {
    fs.writeFile(path, context, (err) => {
      if (err) throw err
      resolve()
    })
  })
}

module.exports = {
  copyFile,
  copyDir,
  removeFile,
  fileDisplay,
  readFile,
  writeFile,
}
