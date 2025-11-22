import multer from 'multer'
import { extname, resolve } from 'path'
import fs from 'fs'

const aleatorio = () => Math.floor(Math.random() * 10000 + 10000)

const uploadDir = resolve(__dirname, '..', '..', 'uploads', 'files')

// garante que o diretório exista
try {
    fs.mkdirSync(uploadDir, { recursive: true })
} catch (err) {
    // ignore
}

export default {
    fileFilter: (req, file, cb) => {
        // aceitar imagens e PDFs
        const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
        if (!allowed.includes(file.mimetype)) {
            return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Tipo de arquivo inválido (aceita PNG/JPG/PDF)'))
        }
        cb(null, true)
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir)
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}_${aleatorio()}${extname(file.originalname)}`)
        }
    })
}
