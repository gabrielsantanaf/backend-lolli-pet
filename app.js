import dotenv from 'dotenv'
import express from 'express'
import { resolve } from 'path'
import cors from 'cors'

import homeRoutes from './src/routes/homeRoutes'
import veterinarioRoutes from './src/routes/veterinarioRoutes'
import tokenRoutes from './src/routes/tokenRoutes'
import fotoRoutes from './src/routes/fotoRoutes'
import clienteRoutes from './src/routes/clienteRoutes'
import petRoutes from './src/routes/petRoutes'
import agendamentoRoutes from './src/routes/agendamentoRoutes'
import prontuarioRoutes from './src/routes/prontuarioRoutes'

import './src/database'

dotenv.config()

class App {
  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
  }

  middlewares() {
    const corsOptions = {
      origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],

      // Permite envio de cookies e headers de autenticação
      credentials: true,

      // Métodos HTTP permitidos
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

      // Headers permitidos
      allowedHeaders: ['Content-Type', 'Authorization'],

      // Headers expostos ao frontend
      exposedHeaders: ['X-Total-Count'],

      // Cache da resposta preflight (em segundos)
      maxAge: 86400, // 24 horas

      // Status de sucesso para requisições OPTIONS
      optionsSuccessStatus: 200
    }

    this.app.use(cors(corsOptions))
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
    this.app.use('/prontuarios', prontuarioRoutes)
  }
}

export default new App().app
