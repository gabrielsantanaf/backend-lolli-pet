import Sequelize, { Model } from 'sequelize'

export default class Agendamento extends Model {
  static init(sequelize) {
    super.init({
      servico: {
        type: Sequelize.ENUM('petshop', 'clinico'),
        defaultValue: 'petshop',
        validate: {
          isIn: {
            args: [['petshop', 'clinico']],
            msg: 'Serviço deve ser petshop ou clinico'
          }
        }
      },
      data_hora: {
        type: Sequelize.DATE,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Data e hora do agendamento são obrigatórias'
          },
          isDate: {
            msg: 'Data e hora inválidas'
          },
          isAfter: {
            args: new Date().toISOString(),
            msg: 'Data do agendamento deve ser futura'
          }
        }
      },
      pet_id: {
        type: Sequelize.INTEGER,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Pet é obrigatório para o agendamento'
          }
        }
      },
      veterinario_id: {  // NOVO CAMPO
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Veterinário é obrigatório' }
        }
      },
      observacoes: {
        type: Sequelize.TEXT,
        defaultValue: '',
        validate: {
          len: {
            args: [0, 500],
            msg: 'Observações não podem exceder 500 caracteres'
          }
        }
      },
      status: {
        type: Sequelize.ENUM('agendado', 'confirmado', 'cancelado', 'concluido'),
        defaultValue: 'agendado',
        validate: {
          isIn: {
            args: [['agendado', 'confirmado', 'cancelado', 'concluido']],
            msg: 'Status inválido'
          }
        }
      }
    }, {
      sequelize,
      tableName: 'agendamentos'
    })

    return this
  }

  static associate(models) {
    this.belongsTo(models.Pet, { foreignKey: 'pet_id', as: 'pet' })
    this.belongsTo(models.Veterinario, { foreignKey: 'veterinario_id', as: 'veterinario' }) // NOVA ASSOCIAÇÃO
  }
}
