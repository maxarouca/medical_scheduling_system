import fs from 'fs'

export default function writeFile(
  fileData,
  callback,
  filePath,
  encoding = 'utf8'
) {
  fs.writeFile(filePath, fileData, encoding, (err) => {
    if (err) {
      throw err
    }

    callback()
  })
}
