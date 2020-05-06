import { formatISO } from 'date-fns'
import { Op } from 'sequelize'
import Sale from '../models/Sale'

class TaxController {
  async index(req, res) {
    const { startDate, endDate } = req.query

    const start = formatISO(new Date(startDate))
    const end = formatISO(new Date(endDate))

    const sales = await Sale.findAll({
      where: {
        date: {
          [Op.between]: [start, end],
        },
      },
    })

    if (sales.length === 0) {
      return res
        .status(201)
        .json({ message: 'Nenhuma venda efetuada no período selecionado' })
    }

    const rough = sales
      .map((sale) => sale.total)
      .reduce((total, value) => total + value)

    const roughFormatted = rough.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    const tax = ((rough * 6) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    const profit = (rough - (rough * 6) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    return res.json({
      rough: roughFormatted,
      profit,
      tax,
    })
  }
}

export default new TaxController()
