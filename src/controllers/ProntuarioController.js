import Prontuario from '../models/Prontuario'
import Pet from '../models/Pet'

const TIPOS_VALIDOS = ['Consulta', 'Exame', 'Vacina', 'Banho', 'Tosa', 'Outro']

class ProntuarioController {
  async index(req, res) {
    try {
      const { pet_id } = req.query

      if (!pet_id) return res.status(400).json({ errors: ['pet_id é obrigatório'] })

      const prontuarios = await Prontuario.findAll({
        where: { pet_id },
        attributes: ['id', 'pet_id', 'data', 'tipo', 'descricao', 'responsavel'],
        include: [
          {
            association: 'arquivos',
            attributes: ['id', 'nome', 'filename', 'url']
          }
        ],
        order: [['data', 'DESC']]
      })

      return res.json(prontuarios)
    } catch (err) {
      return res.status(500).json({ errors: [err.message] })
    }
  }

  async store(req, res) {
    try {
      const { pet_id, data, tipo, descricao, responsavel } = req.body

      if (!pet_id) return res.status(400).json({ errors: ['pet_id é obrigatório'] })
      if (!data) return res.status(400).json({ errors: ['data é obrigatória'] })
      if (!tipo) return res.status(400).json({ errors: ['tipo é obrigatório'] })
      if (!descricao) return res.status(400).json({ errors: ['descricao é obrigatória'] })
      if (!responsavel) return res.status(400).json({ errors: ['responsavel é obrigatório'] })

      if (!TIPOS_VALIDOS.includes(tipo)) return res.status(400).json({ errors: ['tipo inválido'] })

      if (descricao.length > 1000) return res.status(400).json({ errors: ['descricao excede 1000 caracteres'] })

      const pet = await Pet.findByPk(pet_id)
      if (!pet) return res.status(400).json({ errors: ['Pet não encontrado'] })

      const prontuario = await Prontuario.create({ pet_id, data, tipo, descricao, responsavel })

      // retornar com campo arquivos vazio (ou com itens se forem adicionados posteriormente)
      const result = {
        id: prontuario.id,
        pet_id: prontuario.pet_id,
        data: prontuario.data,
        tipo: prontuario.tipo,
        descricao: prontuario.descricao,
        responsavel: prontuario.responsavel,
        arquivos: []
      }

      return res.json(result)
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map(e => e.message) })
      return res.status(400).json({ errors: [err.message] })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const updates = req.body

      const prontuario = await Prontuario.findByPk(id, {
        include: [{ association: 'arquivos', attributes: ['id', 'nome', 'filename', 'url'] }]
      })

      if (!prontuario) return res.status(404).json({ errors: ['Prontuário não encontrado'] })

      if (updates.tipo && !TIPOS_VALIDOS.includes(updates.tipo)) return res.status(400).json({ errors: ['tipo inválido'] })
      if (updates.descricao && updates.descricao.length > 1000) return res.status(400).json({ errors: ['descricao excede 1000 caracteres'] })

      const prontuarioAtualizado = await prontuario.update(updates)

      const result = {
        id: prontuarioAtualizado.id,
        pet_id: prontuarioAtualizado.pet_id,
        data: prontuarioAtualizado.data,
        tipo: prontuarioAtualizado.tipo,
        descricao: prontuarioAtualizado.descricao,
        responsavel: prontuarioAtualizado.responsavel,
        arquivos: prontuarioAtualizado.arquivos || []
      }

      return res.json(result)
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map(e => e.message) })
      return res.status(400).json({ errors: [err.message] })
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params

      const prontuario = await Prontuario.findByPk(id)
      if (!prontuario) return res.status(404).json({ errors: ['Prontuário não encontrado'] })

      await prontuario.destroy()
      return res.json(null)
    } catch (err) {
      return res.status(400).json({ errors: [err.message] })
    }
  }
}

export default new ProntuarioController()
