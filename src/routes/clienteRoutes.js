import { Router } from 'express'
import clienteController from '../controllers/ClienteController'
import loginRequired from '../middlewares/loginRequired'

const router = new Router()

router.post('/', loginRequired, clienteController.store)
router.get('/', loginRequired, clienteController.index)
router.get('/:id', loginRequired, clienteController.show)
router.put('/', loginRequired, clienteController.update)
router.delete('/', loginRequired, clienteController.delete)

export default router
