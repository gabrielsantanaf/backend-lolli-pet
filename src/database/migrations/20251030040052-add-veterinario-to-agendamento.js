'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('agendamentos', 'veterinario_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'veterinarios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      after: 'pet_id' // Posiciona a coluna após pet_id (opcional, nem todos os DBs suportam)
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('agendamentos', 'veterinario_id');
  }
};
