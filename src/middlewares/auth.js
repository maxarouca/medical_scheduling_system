import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import User from '../app/models/User'

import authConfig from '../config/auth'

export default async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Usuário não autenticado' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)

    const { name, email } = await User.findByPk(decoded.id)

    req.userId = decoded.id
    req.user = { name, email }

    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Usuário não autenticado' })
  }
}
