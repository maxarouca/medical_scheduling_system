import { formatISO, addDays } from 'date-fns'
import { Op } from 'sequelize'
import Sale from '../models/Sale'
import formatToMoney from '../../util/formatToMoney'

class TaxController {
  async index(req, res) {
    const { startDate, endDate, tax } = req.query

    const start = formatISO(new Date(startDate))
    const end = formatISO(addDays(new Date(endDate), 1))

    console.log(start, end)

    const sales = await Sale.findAll({
      where: {
        date: {
          [Op.between]: [start, end],
        },
        user_email: req.user.email,
        tax,
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

    const discountAliquot = (rough * 18.5) / 100

    const discountTax = ((rough - discountAliquot) * tax) / 100

    const profit = rough - (rough * 18.5) / 100 - discountTax

    return res.json({
      rough: formatToMoney(roughFormatted),
      aliquot: formatToMoney(discountAliquot),
      tax: formatToMoney(discountTax),
      profit: formatToMoney(profit),
    })
  }
}

export default new TaxController()
