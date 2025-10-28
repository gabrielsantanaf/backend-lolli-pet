import Pet from '../models/Pet'
import Cliente from '../models/Cliente'

class PetController {
    async store(req, res) {
        try {
            const { cliente_id } = req.body

            if (!cliente_id) {
                return res.status(400).json({ errors: ['cliente_id é obrigatório'] })
            }

            // opcional: checar se cliente existe
            const cliente = await Cliente.findByPk(cliente_id)
            if (!cliente) {
                return res.status(400).json({ errors: ['Cliente não encontrado'] })
            }

            const { id, nome, especie, raca } = await Pet.create(req.body)

            return res.json({ id, nome, especie, raca, cliente_id })
        } catch (err) {
            if (err.errors) {
                return res.status(400).json({ errors: err.errors.map(e => e.message) })
            }
            return res.status(400).json({ errors: [err.message] })
        }
    }

    async index(req, res) {
        try {
            const pets = await Pet.findAll({
                attributes: ['id', 'nome', 'especie', 'raca', 'cliente_id'],
                include: [{ association: 'cliente', attributes: ['id', 'nome', 'email'] }]
            })

            return res.json(pets)
        } catch (err) {
            return res.status(500).json({ errors: [err.message] })
        }
    }

    async show(req, res) {
        try {
            const pet = await Pet.findByPk(req.params.id, {
                attributes: ['id', 'nome', 'especie', 'raca', 'cliente_id'],
                include: [{ association: 'cliente', attributes: ['id', 'nome', 'email'] }]
            })

            if (!pet) return res.status(404).json({ errors: ['Pet não encontrado'] })

            return res.json(pet)
        } catch (err) {
            return res.status(500).json({ errors: [err.message] })
        }
    }

    async update(req, res) {
        try {
            const pet = await Pet.findByPk(req.params.id)
            if (!pet) return res.status(400).json({ errors: ['Pet não existe.'] })

            const { id, nome, especie, raca, cliente_id } = await pet.update(req.body)
            return res.json({ id, nome, especie, raca, cliente_id })
        } catch (err) {
            if (err.errors) {
                return res.status(400).json({ errors: err.errors.map(e => e.message) })
            }
            return res.status(400).json({ errors: [err.message] })
        }
    }

    async delete(req, res) {
        try {
            const pet = await Pet.findByPk(req.params.id)
            if (!pet) return res.status(400).json({ errors: ['Pet não existe.'] })

            await pet.destroy()
            return res.json(null)
        } catch (err) {
            return res.status(400).json({ errors: [err.message] })
        }
    }
}

export default new PetController()
