import Sequelize, { Model } from 'sequelize'

class Sale extends Model {
  static init(sequelize) {
    super.init(
      {
        quantity: Sequelize.NUMBER,
        date: Sequelize.DATE,
        tax: Sequelize.NUMBER,
        is_pay: Sequelize.BOOLEAN,
        total: Sequelize.NUMBER,
        unitary_value: Sequelize.NUMBER,
      },
      {
        sequelize,
      }
    )
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_email', as: 'email' })
  }
}

export default Sale
