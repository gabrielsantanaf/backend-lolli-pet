import Sequelize, { Model } from 'sequelize'

export default class Pet extends Model{
  static init(sequelize){
    super.init({
      nome: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: { len: { args: [1, 255], msg: 'Nome do pet precisa ter entre 1 e 255 caracteres' } }
      },
      especie: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      raca: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        defaultValue: null
      }
    },{
      sequelize,
      tableName: 'pets'
    })

    return this
  }

  static associate(models){
    this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' })
  }
}
