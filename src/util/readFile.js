import fs from 'fs'

export default function readFile(
  filePath,
  returnJson = false,
  encoding = 'utf8',
  callback
) {
  fs.readFile(filePath, encoding, (err, data) => {
    if (err) {
      throw err
    }

    callback(returnJson ? JSON.parse(data) : data)
  })
}
