import multer from "multer"
import multerConfig from "../config/multerConfig"
import Foto from '../models/Foto'

const upload = multer(multerConfig).single('foto')

class FotoController {
  store(req, res) {
    return upload(req, res, async (err) => {
      if (err) {
        console.log('Erro do multer:', err)
        return res.status(400).json({
          errors: [err.message || err.code]
        })
      }

      if (!req.file) {
        console.log('Nenhum arquivo foi enviado')
        return res.status(400).json({
          errors: ['Nenhum arquivo foi enviado']
        })
      }

      console.log('Arquivo recebido:', req.file)
      console.log('Body recebido:', req.body)

      const { originalname, filename } = req.file
      const { cliente_id } = req.body

      if (!cliente_id) {
        return res.status(400).json({
          errors: ['cliente_id é obrigatório']
        })
      }

      try {
        const foto = await Foto.create({ originalname, filename, cliente_id })
        return res.json(foto)
      } catch (error) {
        console.log('Erro ao criar foto:', error)
        return res.status(400).json({
          errors: ['Erro ao salvar foto no banco de dados']
        })
      }
    })
  }
}

export default new FotoController()

