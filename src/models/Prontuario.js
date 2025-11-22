import Sequelize, { Model } from 'sequelize'

export default class Prontuario extends Model {
    static init(sequelize) {
        super.init(
            {
                pet_id: {
                    type: Sequelize.INTEGER,
                    defaultValue: null
                },
                data: {
                    type: Sequelize.DATE,
                    defaultValue: ''
                },
                tipo: {
                    type: Sequelize.ENUM('Consulta', 'Exame', 'Vacina', 'Banho', 'Tosa', 'Outro'),
                    defaultValue: 'Consulta'
                },
                descricao: {
                    type: Sequelize.TEXT,
                    defaultValue: ''
                },
                responsavel: {
                    type: Sequelize.STRING,
                    defaultValue: ''
                }
            },
            {
                sequelize,
                tableName: 'prontuarios'
            }
        )

        return this
    }

    static associate(models) {
        this.belongsTo(models.Pet, { foreignKey: 'pet_id', as: 'pet' })
        this.hasMany(models.ProntuarioArquivo, { foreignKey: 'prontuario_id', as: 'arquivos' })
    }
}
