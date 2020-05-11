import fs from 'fs'

import objToArray from './objToArray'

export default async function loadData(file) {
  const dataBD = await fs.readFileSync(file, 'utf-8', function(err, data) {
    if (err) throw err
    return data
  })

  const dataJSON = dataBD ? JSON.parse(dataBD) : null

  const finalData = dataJSON ? objToArray(dataJSON) : []

  return finalData
}
