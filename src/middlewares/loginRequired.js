import jwt from 'jsonwebtoken'
import Veterinario from '../models/Veterinario'

export default async(req, res, next) => {
  const { authorization } = req.headers

  console.log('Header authorization:', authorization)

  if(!authorization)
    return res.status(401).json({
      errors: ['Login required'],
    })

  const parts = authorization.split(' ')

  if(parts.length !== 2) {
    console.log('Formato de authorization inválido:', authorization)
    return res.status(401).json({
      errors: ['Formato de token inválido'],
    })
  }

  const [scheme, token] = parts

  if(scheme !== 'Bearer') {
    console.log('Scheme inválido:', scheme)
    return res.status(401).json({
      errors: ['Token deve começar com Bearer'],
    })
  }

  try{
    const dados = jwt.verify(token, process.env.TOKEN_SECRET)
    const { id, email } = dados

    console.log('Token decodificado:', { id, email })

    const veterinario = await Veterinario.findOne({
      where: {
        id,
        email
      }
    })

    if(!veterinario) {
      console.log('Veterinário não encontrado:', { id, email })
      return res.status(401).json({
        errors: ['Usuário inválido'],
      })
    }

    req.veterinarioId = id
    req.veterinarioEmail = email

    return next()

  } catch(err){
    console.log('Erro na verificação do token:', err.message)
    return res.status(401).json({
      errors: ['Token expirado ou inválido'],
    })
  }
}
