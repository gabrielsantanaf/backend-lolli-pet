import Veterinario from '../models/Veterinario'

class VeterinarioController {
  async store(req, res) {
    try {
      const { id, nome, email } = await Veterinario.create(req.body)

      return res.json({ id, nome, email })
    } catch (err) {
      if (err.errors) {
        return res.status(400).json({ errors: err.errors.map(err => err.message) })
      }

      return res.status(400).json({ errors: [err.message] })
    }
  }

  async index(req, res) {
    try {
      const veterinarios = await Veterinario.findAll({ attributes: ['id', 'nome', 'email'] })

      return res.json(veterinarios)
    } catch (err) {
      return res.json(err)
    }
  }

  async show(req, res) {
    try {
      //const veterinario = await Veterinario.findByPk(req.params.id)
      const veterinarioId = req.veterinarioId || req.veterinario_id

      const veterinario = await Veterinario.findByPk(veterinarioId, {
        attributes: [ 'id' , 'nome', 'email']
      })

      if (!veterinario)
        return res.status(404).json({err: ['Veterinário não encontrado']})

      return res.json(veterinario)
    } catch (err) {
      return res.status(500).json({err: [err.message]})
    }
  }

  async update(req, res) {
    try {
      const veterinario = await Veterinario.findByPk(req.veterinarioId)

      if (!veterinario)
        return res.status(400).json({
          errors: ['Veterinário não existe.']
        })

      const { id, nome, email } = await veterinario.update(req.body)

      return res.json({ id, nome, email })
    } catch (err) {
      return res.status(400).json({ errors: err.errors.map(err => err.message) })
    }
  }

  async delete(req, res) {
    try {
      const veterinario = await Veterinario.findByPk(req.veterinarioId)

      if (!veterinario)
        return res.status(400).json({
          errors: ['Veterinário não existe.']
        })

      await veterinario.destroy()

      return res.json(null)
    } catch (err) {
      return res.status(400).json({ errors: err.errors.map(err => err.message) })
    }
  }
}

export default new VeterinarioController()
