import * as Yup from 'yup'

import { formatISO, addDays } from 'date-fns'
import { Op } from 'sequelize'
import Sale from '../models/Sale'

class SaleController {
  async index(req, res) {
    const query = { req }

    const isEmpty = () => {
      return JSON.stringify(query) === '{}'
    }

    if (!isEmpty) {
      const { startDate, endDate } = req.query

      const start = formatISO(new Date(startDate))
      const end = () => {
        if (startDate === endDate) {
          return addDays(new Date(endDate), 1)
        }
        return formatISO(new Date(endDate), 10)
      }

      const sales = await Sale.findAll({
        where: {
          date: {
            [Op.between]: [start, end()],
          },
          user_email: req.user.email,
        },
      })

      if (sales.length === 0) {
        return res
          .status(201)
          .json({ message: 'Nenhuma venda efetuada no período selecionado' })
      }

      return res.json({ sales })
    }

    const sales = await Sale.findAll({
      where: {
        user_email: req.user.email,
      },
    })
    return res.json({ sales })
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      quantity: Yup.number().required(),
      date: Yup.date().required(),
      tax: Yup.number().required(),
      is_pay: Yup.boolean().required(),
      total: Yup.number().required(),
      unitary_value: Yup.number().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error:
          'Falha na validação dos dados. Verifique se todos os campos foram corretamente preenchidos.',
      })
    }

    const newSale = {
      ...req.body,
      user_email: req.user.email,
    }

    console.log(newSale)

    const {
      id,
      quantity,
      date,
      tax,
      is_pay,
      total,
      unitary_value,
      user_email,
    } = await Sale.create(newSale)
    return res.json({
      id,
      quantity,
      date,
      tax,
      is_pay,
      total,
      unitary_value,
      user_email,
    })
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      quantity: Yup.number().required(),
      date: Yup.date().required(),
      tax: Yup.number().required(),
      is_pay: Yup.boolean().required(),
      total: Yup.number().required(),
      unitary_value: Yup.number().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error:
          'Falha na validação dos dados. Verifique se todos os campos foram corretamente preenchidos. ',
      })
    }

    const { id } = req.params

    const sale = await Sale.findByPk(id)

    if (!sale) {
      return res.status(400).json({ error: 'Venda não encontrada' })
    }

    const [, affectedRows] = await Sale.update(
      { ...req.body },
      { where: { id: req.params.id }, returning: true, plain: true }
    )
    return res.json({ ...affectedRows.dataValues })
  }

  async destroy(req, res) {
    const { id } = req.params

    const sale = await Sale.findByPk(id)

    if (!sale) {
      return res.status(400).json({ error: 'Venda não encontrada' })
    }

    await Sale.destroy({ where: { id } })

    return res.json({ sale })
  }
}

export default new SaleController()
