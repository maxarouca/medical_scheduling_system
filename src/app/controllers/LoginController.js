import jwt from 'jsonwebtoken'
import * as Yup from 'yup'
import { resolve } from 'path'
import fs from 'fs'
import bcrytpt from 'bcryptjs'

import objToArray from '../../util/objToArray'
import authConfig from '../../config/auth'

const file = resolve(__dirname, '..', '..', 'database', 'users.json')
function checkPassword(password, password_hash) {
  return bcrytpt.compare(password, password_hash)
}

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails' })
    }

    const { email, password } = req.body

    const dataBD = await fs.readFileSync(file, 'utf-8', function(err, dataBD) {
      if (err) throw err
      return dataBD
    })

    const usersData = dataBD ? JSON.parse(dataBD) : null

    const users = usersData ? objToArray(usersData) : []

    const userExists = users.find((item) => item.email === req.body.email)

    if (!userExists) {
      return res.status(401).json({ message: 'User not found.' })
    }

    if (!(await checkPassword(password, userExists.password_hash))) {
      return res.status(401).json({ message: 'Password does not match.' })
    }

    const { id, name } = userExists

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    })
  }
}

export default new SessionController()
