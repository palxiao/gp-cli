const fs = require('fs')

const path = `.build.version`

function tv() {
  try {
    fs.readFile(path, function (err, data) {
      if (err) {
        fs.writeFile(path, '{ "version": "1.0" }', 'utf8', function (error) {
          tv()
        })
        return false
      }
      const packJson = JSON.parse(data.toString())

      // 编译独立版本号
      let version = packJson.buildVersion ? packJson.buildVersion.split('.') : '1.0.0'.split('.')

      version[version.length - 1] = +version[version.length - 1] + 1
      packJson.buildVersion = version.join('.')
      fs.writeFile(path, JSON.stringify(packJson, '', '\t'), (err) => {
        if (err) throw err
      })
    })
  } catch (e) {}
}

module.exports = tv
