import * as Yup from 'yup'
import { resolve } from 'path'
import fs from 'fs'
import { uuid } from 'uuidv4'
import bcrytpt from 'bcryptjs'

import loadData from '../../util/loadData'
import checkPassword from '../../util/checkPassword'

const file = resolve(__dirname, '..', '..', 'database', 'users.json')

class UserController {
  async index(req, res) {
    const users = await loadData(file)
    return res.json({ users })
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        message:
          'Falha na validação dos dados. Verifique se todos os campos foram corretamente preenchidos.',
      })
    }

    const users = await loadData(file)

    const userExists = users.find((item) => item.email === req.body.email)

    if (userExists) {
      return res
        .status(400)
        .json({ message: 'Já existe um usuário cadastrado com esse email.' })
    }

    const user = req.body

    if (user.password) {
      user.password_hash = await bcrytpt.hash(user.password, 8)
      delete user.password
    }

    user.id = uuid()

    users.push({ ...req.body })

    const { id, name, email } = user

    await fs.writeFileSync(file, JSON.stringify(users), function(err) {
      if (err) throw err
    })

    return res.json({ id, name, email })
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .min(6)
        .when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        message:
          'Falha na validação dos dados. Verifique se todos os campos foram corretamente preenchidos.',
      })
    }

    const users = await loadData(file)

    const { name, email, oldPassword } = req.body

    const user = await users.find((item) => item.id === req.userId)
    const userIndex = await users.findIndex((item) => item.id === req.userId)

    if (email !== user.email) {
      const userExists = users.find((item) => item.email === req.body.email)

      if (userExists) {
        return res
          .status(400)
          .json({ message: 'Já existe um usuário cadastrado com esse email.' })
      }
    }

    if (
      oldPassword &&
      !(await checkPassword(oldPassword, user.password_hash))
    ) {
      return res.status(401).json({
        message: 'Senha inválida. Por favor, digite a senha corretamente.',
      })
    }

    user.name = req.body.name
    user.password_hash = await bcrytpt.hash(req.body.password, 8)

    users[userIndex] = { ...user }

    const { id } = user

    await fs.writeFileSync(file, JSON.stringify(users), function(err) {
      if (err) throw err
    })

    return res.json({ id, name, email })
  }
}

export default new UserController()
