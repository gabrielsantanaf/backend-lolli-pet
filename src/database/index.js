import Sequelize from 'sequelize'
import databaseConfig from '../config/database'
import Veterinario from '../models/Veterinario'
import Foto from '../models/Foto'
import Cliente from '../models/Cliente'
import Pet from '../models/Pet'
import Prontuario from '../models/Prontuario'
import ProntuarioArquivo from '../models/ProntuarioArquivo'
import Agendamento from '../models/Agendamento'

const models = [Veterinario, Foto, Cliente, Pet, Prontuario, ProntuarioArquivo, Agendamento]

const connection = new Sequelize(databaseConfig)

models.forEach((model) => { model.init(connection) })
models.forEach((model) => { model.associate && model.associate(connection.models) })
