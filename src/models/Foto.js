import Sequelize, { Model } from 'sequelize'
import urlConfig from '../config/urlConfig'

export default class Foto extends Model {
  static init(sequelize) {
    super.init(
      {
        originalname: {
          type: Sequelize.STRING,
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'Campo não deve ser vazio'
            }
          }
        },

        filename: {
          type: Sequelize.STRING,
          defaultValue: '',
          validate: {
            notEmpty: {
              msg: 'Campo não deve ser vazio'
            }
          }
        },
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${urlConfig.url}/images/${this.filename}`
          }
        }
      },
      {
        sequelize,
        tableName: 'fotos'
      })
    return this
  }

  static associate(models) {
    // trocar referência para Cliente (projeto agora usa 'clientes')
    this.belongsTo(models.Cliente, { foreignKey: 'cliente_id' })
  }
}
