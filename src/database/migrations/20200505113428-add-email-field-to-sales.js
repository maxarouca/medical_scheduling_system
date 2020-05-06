module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'sales', // name of Source model
      'user_email', // name of the key we're adding
      {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users', // name of Target model
          key: 'email', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'sales', // name of Source model
      'user_email' // key we want to remove
    )
  },
}
