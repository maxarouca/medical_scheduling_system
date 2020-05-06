import Sequelize from 'sequelize'

import User from '../app/models/User'
import Sale from '../app/models/Sale'

import databaseConfig from '../config/database'

const models = [User, Sale]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(databaseConfig)

    models.map((model) => model.init(this.connection))
    Sale.associate(this.connection.models)
  }
}

export default new Database()
