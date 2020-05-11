import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import { resolve } from 'path'
import fs from 'fs'
import authConfig from '../config/auth'

import objToArray from '../util/objToArray'

const file = resolve(__dirname, '..', 'database', 'users.json')

export default async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Usuário não autenticado' })
  }

  const [, token] = authHeader.split(' ')

  try {
    // console.log(token)
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)

    const dataBD = await fs.readFileSync(file, 'utf-8', function(err, data) {
      if (err) throw err
      return data
    })

    const usersData = dataBD ? JSON.parse(dataBD) : null

    const users = usersData ? objToArray(usersData) : []

    // console.log(users)

    const user = await users.find((item) => item.id === decoded.id)
    // console.log(users, decoded.id, user)
    const { name, email } = user

    req.userId = decoded.id
    req.user = { name, email }

    return next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Usuário não autenticado' })
  }
}
