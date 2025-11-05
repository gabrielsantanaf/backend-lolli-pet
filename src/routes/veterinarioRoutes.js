import { Router } from 'express'
import veterinarioController from '../controllers/VeterinarioController'
import loginRequired from '../middlewares/loginRequired'

const router = new Router()

router.post('/', veterinarioController.store)
router.get('/', veterinarioController.index)
//router.get('/:id', veterinarioController.show)
router.get('/me', loginRequired, veterinarioController.show)
router.put('/', loginRequired, veterinarioController.update)
router.delete('/', loginRequired, veterinarioController.delete)

export default router
