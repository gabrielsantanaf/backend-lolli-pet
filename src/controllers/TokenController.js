import Veterinario from '../models/Veterinario'
import jwt from 'jsonwebtoken'

class TokenController {
  async store(req, res) {
    const { email = '', password = '' } = req.body

    if (!email || !password)
      return res.status(401).json({
        errors: ['Credenciais inválida']
      })

    const veterinario = await Veterinario.findOne({ where: { email: email } })

    if (!veterinario)
      return res.status(401).json({
        errors: ['Usuário não existe']
      })

    if (!(await veterinario.passwordIsValid(password)))
      return res.status(401).json({
        errors: ['Senha inválida']
      })

    const { id } = veterinario
    const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION
    })

    return res.json({ token })
  }
}

export default new TokenController()
