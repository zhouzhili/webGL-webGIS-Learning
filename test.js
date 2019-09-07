const fs = require('fs')

function red(path) {
  var pa = fs.readdirSync(path)
  pa.forEach(ele => {
    var info = fs.statSync(path + '/' + ele)
    if (info.isDirectory()) {
      console.log('dir: ' + ele)
    } else {
      console.log('file: ' + ele)
    }
  })
}

red('./webglCodes/LoadGLTF')
