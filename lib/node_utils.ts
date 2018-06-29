import { platform, logError } from './utils'

function envJudgment (methodName:string) {
  if (!platform.node && !platform.electron) {
    logError('Environment', `[ NodeUtils.${methodName} ] method Must be used in "node" or "electron"`, true)
  }
}

export function copyForder (fromPath:string, toPath:string, needCompolete?:boolean) : Promise<never> {
  envJudgment('copyForder')

  return new Promise((_resolve:Function) => {
    const fs = require('fs')
    const join = require('path').join
    let size = null

    function copyDir (singleFromPath:string, singleToPath:string) {
      if (!fs.existsSync(singleToPath)) {
        fs.mkdirSync(singleToPath)
      }

      fs.readdir(singleFromPath, (err, files) => {
        if (err) throw err

        for (const file of files) {
          const currentUrl = join(singleFromPath, file)
          const toUrl = join(singleToPath, file)

          fs.stat(currentUrl, (err, stats) => {
            if (err) throw err

            stats.isFile()
              ? copyFile(currentUrl, toUrl)
              : copyDir(currentUrl, toUrl)
          })
        }
      })
    }

    function copyFile (input:string, output:string) {
      fs.createReadStream(input).pipe(
        fs.createWriteStream(output)
      )
    }

    function copyCompolete () {
      process.nextTick(() => {
        if (!fs.existsSync(toPath)) {
          return copyCompolete()
        }

        fs.stat(toPath, (err, stats) => {
          if (err) throw err
          console.log(stats.size, size)
          stats.size === size
            ? _resolve()
            : copyCompolete()
        })
      })
    }

    // 如果不需要监听文件复制完成
    if (!needCompolete) return _resolve()

    fs.stat(fromPath, (err, stats) => {
      if (err) throw err

      size = stats.size
      copyDir(fromPath, toPath)
      copyCompolete()
    })
  })
}

export function deleteForder (path:string, needCompolete?:boolean) : Promise<never> {
  envJudgment('deleteForder')
  return new Promise(_resolve => {
    const fs = require('fs')
    const resolve = require('path').resolve

    if (!fs.existsSync(path)) return _resolve()

    function insertDeleteForder (_path) {
      if(fs.existsSync(_path)) {
        const files = fs.readdirSync(_path)

        for (const file of files) {
          const curPath = resolve(_path, file)

          fs.statSync(curPath).isDirectory()
            ? insertDeleteForder(curPath)
            : fs.unlinkSync(curPath)
        }

        fs.rmdirSync(_path)
      }
    }

    function isDeleteCompolete () {
      process.nextTick(() => {
        fs.exists(path, exists => {
          exists
            ? isDeleteCompolete()
            : _resolve()
        })
      })
    }

    insertDeleteForder(path)

    needCompolete
      ? isDeleteCompolete()
      : _resolve()
  })
}

export function transferFile (from:string, to:string) : Promise<never> {
  envJudgment('transferFile')
  return new Promise((_resolve:Function) => {
    const fs = require('fs')
    const read_stream = fs.createReadStream(from)
    const write_stream = fs.createWriteStream(to)

    read_stream.pipe(write_stream)
    read_stream.on('end', (err) => {
      if (err) throw err
      _resolve()
    })
  })
}

export function getIp (family = 'IPv4') : string[] {
  envJudgment('getIp')
  const interfaces = require('os').networkInterfaces()

  return Object.keys(interfaces).reduce((arr, x) => {
    const interfce = interfaces[x]

    return arr.concat((<any>Object.keys(interfce))
      .filter(x => interfce[x].family === family && !interfce[x].internal)
      .map(x => interfce[x].address))
  }, [])
}