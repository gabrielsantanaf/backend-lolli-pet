//import Aluno from '../models/Aluno'

class HomeController{
  async index(req, res) {
    res.json('Index')
  }
}

export default new HomeController()

/*
index -> Lista todos os usuários -> GET
store/create -> cria um novo usuário -> POST
delete -> apaga um usuário -> DELETE
show -> mostra um usuário -> GET
update -> atualiza um usuário -> PUT OU PATCH
*/
