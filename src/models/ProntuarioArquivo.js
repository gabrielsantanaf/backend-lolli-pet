import Sequelize, { Model } from 'sequelize'
import urlConfig from '../config/urlConfig'

export default class ProntuarioArquivo extends Model {
    static init(sequelize) {
        super.init(
            {
                nome: {
                    type: Sequelize.STRING,
                    defaultValue: ''
                },
                filename: {
                    type: Sequelize.STRING,
                    defaultValue: ''
                },
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `${urlConfig.url}/files/${this.filename}`
                    }
                }
            },
            {
                sequelize,
                tableName: 'prontuario_arquivos'
            }
        )

        return this
    }

    static associate(models) {
        this.belongsTo(models.Prontuario, { foreignKey: 'prontuario_id' })
    }
}
