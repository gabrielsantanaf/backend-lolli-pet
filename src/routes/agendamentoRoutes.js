import { Router } from 'express'
import agendamentoController from '../controllers/AgendamentoController'
import loginRequired from '../middlewares/loginRequired'

const router = new Router()

router.post('/', loginRequired, agendamentoController.store)
router.get('/', loginRequired, agendamentoController.index)
router.get('/:id', loginRequired, agendamentoController.show)
router.put('/', loginRequired, agendamentoController.update)
router.delete('/', loginRequired, agendamentoController.delete)

export default router
