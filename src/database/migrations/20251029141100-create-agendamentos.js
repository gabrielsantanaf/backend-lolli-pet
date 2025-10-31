'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agendamentos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      servico: {
        type: Sequelize.ENUM('petshop', 'clinico'),
        allowNull: false
      },
      data_hora: {
        type: Sequelize.DATE,  // Armazena data e hora completas
        allowNull: false
      },
      pet_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pets',  // Referência à tabela de pets
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'  // Se deletar o pet, deleta o agendamento
      },
      observacoes: {
        type: Sequelize.TEXT,
        allowNull: true  // Campo opcional para anotações
      },
      status: {
        type: Sequelize.ENUM('agendado', 'confirmado', 'cancelado', 'concluido'),
        allowNull: false,
        defaultValue: 'agendado'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('agendamentos');
  }
};
