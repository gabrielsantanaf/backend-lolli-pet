import dotenv from 'dotenv'
import express from 'express'
import { resolve } from 'path'

import homeRoutes from './src/routes/homeRoutes'
import veterinarioRoutes from './src/routes/veterinarioRoutes'
import tokenRoutes from './src/routes/tokenRoutes'
import fotoRoutes from './src/routes/fotoRoutes'
import clienteRoutes from './src/routes/clienteRoutes'
import petRoutes from './src/routes/petRoutes'
import agendamentoRoutes from './src/routes/agendamentoRoutes'

import './src/database'

dotenv.config()

class App {
  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.app.use(express.urlencoded({
      extended: true
    }))
    this.app.use(express.json())
    this.app.use(express.static(resolve(__dirname, 'uploads')))
  }

  routes() {
    this.app.use('/', homeRoutes)
    this.app.use('/veterinarios/', veterinarioRoutes)
    this.app.use('/token/', tokenRoutes)
    this.app.use('/fotos/', fotoRoutes)
    this.app.use('/clientes', clienteRoutes)
    this.app.use('/pets', petRoutes)
    this.app.use('/agendamentos', agendamentoRoutes)
  }
}

export default new App().app
