import { Router } from 'express'
import petController from '../controllers/PetController'
import loginRequired from '../middlewares/loginRequired'

const router = new Router()

router.post('/', loginRequired, petController.store)
router.get('/', loginRequired, petController.index)
router.get('/:id', loginRequired, petController.show)
router.put('/', loginRequired, petController.update)
router.delete('/', loginRequired, petController.delete)

export default router
