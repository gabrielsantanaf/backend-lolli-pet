'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Usando SQL raw devido a bug conhecido do Sequelize com MariaDB ao remover colunas
    await queryInterface.sequelize.query(
      'ALTER TABLE `clientes` DROP COLUMN `sobrenome`;'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('clientes', 'sobrenome', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
