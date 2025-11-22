import { Router } from 'express'
import ProntuarioController from '../controllers/ProntuarioController'
import loginRequired from '../middlewares/loginRequired'
import ProntuarioArquivoController from '../controllers/ProntuarioArquivoController'

const router = new Router()

router.get('/', loginRequired, ProntuarioController.index)
router.post('/', loginRequired, ProntuarioController.store)
router.put('/:id', loginRequired, ProntuarioController.update)
router.delete('/:id', loginRequired, ProntuarioController.delete)

// arquivos do prontuário
router.post('/:id/arquivos', loginRequired, ProntuarioArquivoController.uploadFile)
router.get('/:id/arquivos', loginRequired, ProntuarioArquivoController.list)
router.get('/arquivos/:id', loginRequired, ProntuarioArquivoController.download)
router.delete('/arquivos/:id', loginRequired, ProntuarioArquivoController.remove)

export default router
