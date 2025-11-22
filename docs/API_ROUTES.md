# Documentação da API - backend-lolli-pet

> Esta documentação descreve as rotas exposas pelo backend para uso por desenvolvedores frontend.

**Base URL (local de execução):** `http://localhost:PORT` (PORT conforme seu servidor: `app.js` exporta o Express; ver `server.js` ou `package.json` para o comando `start`).

**Autenticação:**
- A API usa JWT. Endpoints protegidos exigem o header `Authorization: Bearer <token>`.
- O token é obtido em `POST /token/` (ver abaixo).

**Headers comuns:**
- `Content-Type: application/json` para JSON.
- Para upload de arquivos: `Content-Type: multipart/form-data`.

---

**Resumo das rotas montadas em `app.js`:**
- `GET /` → Home
- `POST /token/` → Login / geração de token
- `POST /veterinarios/` `GET /veterinarios/` `GET /veterinarios/me` `PUT /veterinarios/` `DELETE /veterinarios/`
- `POST /fotos/` (upload)
- Cliente: `POST /clientes`, `GET /clientes`, `GET /clientes/:id`, `PUT /clientes/`, `DELETE /clientes/` (ver nota sobre inconsistência)
- Pet: `POST /pets`, `GET /pets`, `GET /pets/:id`, `PUT /pets/`, `DELETE /pets/` (ver nota)
- Agendamento: `POST /agendamentos`, `GET /agendamentos`, `GET /agendamentos/:id`, `PUT /agendamentos/`, `DELETE /agendamentos/` (ver nota)

---

**Detalhamento por recurso**

**1) Home**
- Método: `GET`
- Path: `/`
- Auth: não
- Descrição: rota simples de saúde, retorna string `"Index"`.
- Resposta de sucesso (200):
```json
"Index"
```


**2) Token (Autenticação)**
- Método: `POST`
- Path: `/token/`
- Auth: não
- Request body (application/json):
  - `email` (string) - obrigatório
  - `password` (string) - obrigatório
- Resposta de sucesso (200):
```json
{ "token": "<jwt-token>" }
```
- Erros comuns:
  - 401: credenciais inválidas / usuário não existe / senha inválida
  - 401: falta de `email` ou `password`

Exemplo cURL:
```bash
curl -X POST http://localhost:3000/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"vet@example.com","password":"senha123"}'
```

---

**3) Veterinários**
- Base: `/veterinarios/`

3.1 Criar veterinário
- Método: `POST`
- Path: `/veterinarios/`
- Auth: não
- Body (application/json):
  - `nome` (string, required, 3-255)
  - `email` (string, required, email único)
  - `password` (string, required, 6-50)
- Resposta (200):
```json
{ "id": 1, "nome": "Fulano", "email": "fulano@example.com" }
```
- Erros: 400 com `errors: [...]` quando validações falham

3.2 Listar veterinários
- Método: `GET`
- Path: `/veterinarios/`
- Auth: não
- Resposta (200): array de objetos `{ id, nome, email }`

3.3 Ver dados do veterinário autenticado
- Método: `GET`
- Path: `/veterinarios/me`
- Auth: sim (header `Authorization: Bearer <token>`)
- Observação: o middleware coloca `req.veterinario_id` a partir do token.
- Resposta (200): `{ id, nome, email }` ou 404 se não encontrado

3.4 Atualizar veterinário autenticado
- Método: `PUT`
- Path: `/veterinarios/`
- Auth: sim
- Body (application/json): campos atualizáveis: `nome`, `email`, `password` (se enviar, será gravado como hash)
- Resposta (200): `{ id, nome, email }`
- Erros: 400 quando inválido / não existente

3.5 Excluir veterinário autenticado
- Método: `DELETE`
- Path: `/veterinarios/`
- Auth: sim
- Resposta (200): `null`

Observação: As rotas de update/delete para veterinário fazem uso do `req.veterinarioId / req.veterinario_id` obtido do token, portanto não exigem parâmetro `:id` na URL.

---

**4) Clientes**
- Base: `/clientes`

4.1 Criar cliente
- Método: `POST`
- Path: `/clientes`
- Auth: sim
- Body:
  - `nome` (string, required)
  - `sobrenome` (string)
  - `email` (string, required, formato email)
  - `telefone` (string)
- Resposta (200): `{ id, nome, sobrenome, email, telefone }`
- Erros: 400 quando inválido

4.2 Listar clientes
- Método: `GET`
- Path: `/clientes`
- Auth: sim
- Resposta: array de `{ id, nome, sobrenome, email, telefone }`

4.3 Obter cliente por id
- Método: `GET`
- Path: `/clientes/:id`
- Auth: sim
- Resposta (200): `{ id, nome, sobrenome, email, telefone }` ou 404

4.4 Atualizar cliente
- Método: `PUT`
- Path atual no código: `/clientes/`  <-- atenção (ver nota de inconsistência)
- Auth: sim
- Esperado pelo controller: `req.params.id` (ou seja, a rota deveria ser `/clientes/:id`)
- Body: campos atualizáveis: `nome`, `sobrenome`, `email`, `telefone`
- Resposta (200): `{ id, nome, sobrenome, email, telefone }`
- Erros: 400 quando cliente não existe ou validações falham

4.5 Excluir cliente
- Método: `DELETE`
- Path atual no código: `/clientes/`  <-- atenção (ver nota de inconsistência)
- Auth: sim
- Esperado pelo controller: `req.params.id` (rota deveria ser `/clientes/:id`)
- Resposta: `null` ou 400

---

**5) Pets**
- Base: `/pets`

5.1 Criar pet
- Método: `POST`
- Path: `/pets`
- Auth: sim
- Body:
  - `nome` (string, required)
  - `especie` (string)
  - `raca` (string)
  - `cliente_id` (integer, required) — deve existir no banco
- Resposta (200): `{ id, nome, especie, raca, cliente_id }`
- Erros: 400 quando `cliente_id` faltando ou cliente não encontrado

5.2 Listar pets
- Método: `GET`
- Path: `/pets`
- Auth: sim
- Resposta: array de `{ id, nome, especie, raca, cliente_id, cliente: { id, nome, email } }`

5.3 Obter pet por id
- Método: `GET`
- Path: `/pets/:id`
- Auth: sim
- Resposta (200): objeto pet com associação `cliente` ou 404

5.4 Atualizar pet
- Método: `PUT`
- Path atual no código: `/pets/`  <-- atenção (ver nota)
- Auth: sim
- Esperado pelo controller: `req.params.id` → rota deveria ser `/pets/:id`
- Body: campos atualizáveis `nome`, `especie`, `raca`, `cliente_id`
- Resposta (200): `{ id, nome, especie, raca, cliente_id }`

5.5 Excluir pet
- Método: `DELETE`
- Path atual no código: `/pets/`  <-- atenção (ver nota)
- Auth: sim
- Esperado: `req.params.id` → rota deveria ser `/pets/:id`
- Resposta: `null`

---

**6) Fotos (upload)**
- Base: `/fotos/`
- Método: `POST`
- Auth: sim
- Tipo: `multipart/form-data`
- Campos esperados no form-data:
  - `foto` → arquivo (campo de arquivo, nome do field: `foto`)
  - `cliente_id` → integer (campo no form-data)
- Fluxo: multer recebe arquivo, valida e grava em `uploads/images/`; controller salva `originalname`, `filename` e `cliente_id` no DB.
- Resposta (200): objeto `Foto` com campos `originalname`, `filename`, `url` (virtual que aponta para `/images/<filename>`)

Exemplo cURL (upload):
```bash
curl -X POST http://localhost:3000/fotos/ \
  -H "Authorization: Bearer <token>" \
  -F "foto=@/caminho/para/arquivo.jpg" \
  -F "cliente_id=123"
```

Erros comuns:
- 400: nenhum arquivo enviado
- 400: `cliente_id` obrigatório
- 400: erro do multer (limites, tipos, etc.)

---

**7) Agendamentos**
- Base: `/agendamentos`

7.1 Criar agendamento
- Método: `POST`
- Path: `/agendamentos`
- Auth: sim
- Body (application/json):
  - `servico` (enum: `petshop` | `clinico`) - opcional, default `petshop`
  - `data_hora` (ISO date string) - obrigatório, deve ser futuro
  - `pet_id` (integer) - obrigatório, pet deve existir
  - `observacoes` (string, opcional, max 500)
  - `status` (enum: `agendado`, `confirmado`, `cancelado`, `concluido`) - opcional

- Observação: o `veterinario_id` é obtido a partir do token e injetado automaticamente pelo controller (campo `req.veterinarioId` ou `req.veterinario_id`). Se não houver veterinário no token, será retornado erro 400.
- Resposta (200): objeto com `{ id, servico, data_hora, pet_id, veterinario_id, observacoes, status }`

7.2 Listar agendamentos
- Método: `GET`
- Path: `/agendamentos`
- Auth: sim
- Resposta: array de agendamentos com associações `pet` e `veterinario` (quando houver)

7.3 Obter agendamento por id
- Método: `GET`
- Path: `/agendamentos/:id`
- Auth: sim
- Resposta (200): agendamento detalhado incluindo `pet` (e `cliente` via associação) e `veterinario`

7.4 Atualizar agendamento
- Método: `PUT`
- Path atual no código: `/agendamentos/`  <-- atenção (ver nota)
- Auth: sim
- Esperado pelo controller: `req.params.id` → rota deveria ser `/agendamentos/:id`
- Regras de validação adicionais no controller:
  - Se `veterinario_id` for enviado no body, valida-se existência do veterinário
  - Se `veterinario_id` não for enviado e o agendamento atual não possuir veterinário, será retornado erro
- Resposta (200): agendamento atualizado

7.5 Excluir agendamento
- Método: `DELETE`
- Path atual no código: `/agendamentos/`  <-- atenção (ver nota)
- Auth: sim
- Esperado pelo controller: `req.params.id` → rota deveria ser `/agendamentos/:id`

---

**8) Prontuários (Histórico clínico de um Pet)**
- Base: `/prontuarios`

8.1 Listar histórico de um pet
- Método: `GET`
- Path: `/prontuarios?pet_id=:id`
- Auth: sim (header `Authorization: Bearer <token>`)
- Query params:
  - `pet_id` (integer, obrigatório)
- Descrição: retorna o histórico (prontuários) do pet ordenado por data (desc). Cada item inclui `arquivos` (array com `{ id, nome, filename, url }`).
- Resposta (200): array de objetos
```json
[
  {
    "id": 1,
    "pet_id": 5,
    "data": "2025-11-20T14:00:00.000Z",
    "tipo": "Consulta",
    "descricao": "Check-up de rotina. Peso normal.",
    "responsavel": "Dr. Juliana",
    "arquivos": []
  }
]
```

8.2 Criar entrada no prontuário
- Método: `POST`
- Path: `/prontuarios`
- Auth: sim
- Content-Type: `application/json`
- Body:
```json
{
  "pet_id": 5,
  "data": "2025-11-20",
  "tipo": "Consulta",
  "descricao": "Texto do atendimento",
  "responsavel": "Dr. Fulano"
}
```
- Validações/observações:
  - `pet_id`, `data`, `tipo`, `descricao`, `responsavel` são obrigatórios.
  - `tipo` aceita os valores: `Consulta`, `Exame`, `Vacina`, `Banho`, `Tosa`, `Outro`.
  - `descricao` máximo 1000 caracteres.
  - `pet_id` deve existir no banco.
- Resposta (200): objeto criado (inclui `arquivos: []` por padrão)

8.3 Atualizar entrada do prontuário
- Método: `PUT`
- Path: `/prontuarios/:id`
- Auth: sim
- Body (application/json): qualquer campo atualizável, por exemplo:
```json
{ "descricao": "Texto atualizado", "tipo": "Exame" }
```
- Validações: `tipo` deve ser válido; `descricao` ≤ 1000 chars
- Resposta (200): objeto atualizado

8.4 Deletar entrada do prontuário
- Método: `DELETE`
- Path: `/prontuarios/:id`
- Auth: sim
- Resposta (200): `null` quando removido

---

**Arquivos de Prontuário**

Os arquivos (imagens e PDFs) associados a um prontuário são salvos em disco em `uploads/files` e registrados na tabela `prontuario_arquivos`.

- Tipos aceitos: `image/png`, `image/jpeg`, `image/jpg`, `application/pdf`.
- URL pública (quando disponível): `http://<host>/files/<filename>` (o `app.js` serve `uploads` como estático). Além disso há um endpoint protegido para download.

8.A Upload de arquivo para um prontuário
- Método: `POST`
- Path: `/prontuarios/:id/arquivos`
- Auth: sim
- Content-Type: `multipart/form-data`
- Campo form-data obrigatório: `arquivo` (file)
- Resposta (200): `{ id, nome, url }` (nome = nome original, url = URL pública montada)

Exemplo cURL (upload):
```bash
curl -X POST "http://localhost:3001/prontuarios/10/arquivos" \
  -H "Authorization: Bearer <token>" \
  -F "arquivo=@/caminho/para/arquivo.pdf"
```

8.B Listar arquivos de um prontuário
- Método: `GET`
- Path: `/prontuarios/:id/arquivos`
- Auth: sim
- Resposta (200): array de `{ id, nome, filename, url }`

8.C Download protegido de arquivo
- Método: `GET`
- Path: `/prontuarios/arquivos/:id`
- Auth: sim
- Descrição: faz download/stream do arquivo (usa `res.download` e envia `Content-Disposition` com o nome original)
- Exemplo cURL:
```bash
curl -L -X GET "http://localhost:3001/prontuarios/arquivos/7" \
  -H "Authorization: Bearer <token>" -o "arquivo_original.pdf"
```

8.D Deletar arquivo de prontuário
- Método: `DELETE`
- Path: `/prontuarios/arquivos/:id`
- Auth: sim
- Descrição: remove registro do DB e apaga arquivo do disco

---

---

**Erros padronizados**
- Validações de modelo retornam 400 com formato:
```json
{ "errors": ["mensagem 1", "mensagem 2"] }
```
- Recursos não encontrados costumam retornar 404 com `{ errors: [...] }` ou `{ err: [...] }` em alguns controllers (inconsistência leve no nome do campo)
- Autenticação inválida/ausente retorna 401 com `{ errors: [ ... ] }`

---

**Inconsistências / Observações importantes (recomendadas para frontend e manutenção)**
- Várias rotas de `PUT` e `DELETE` para `clientes`, `pets` e `agendamentos` estão definidas no arquivo de rotas sem `:id` na URL, porém os controllers esperam `req.params.id`. Isso tornará essas rotas inacessíveis corretamente pelo frontend.
  - Arquivos afetados: `src/routes/clienteRoutes.js`, `src/routes/petRoutes.js`, `src/routes/agendamentoRoutes.js`.
  - Recomendação: alterar as rotas `PUT '/'` e `DELETE '/'` para `PUT '/:id'` e `DELETE '/:id'` respectivamente.

- Pequena inconsistência na middleware `loginRequired`: ele injeta `req.veterinario_id` e `req.veterinarioEmail`, mas alguns controllers também verificam `req.veterinarioId` (camelCase). Mesmo que ambos sejam tratados (controllers usam `req.veterinarioId || req.veterinario_id` em alguns pontos), sugiro padronizar para um único nome (`req.veterinarioId`) para evitar confusões.

- Formato de erro não é 100% consistente entre controllers (alguns retornam `err: [...]`, outros `errors: [...]`). Para frontend, trate ambos ou padronize o backend.

---

**Exemplos de requests/responses rápidos**

1) Login
```
POST /token/
Content-Type: application/json

{ "email": "vet@example.com", "password": "senha123" }

200 OK
{ "token": "eyJhb..." }
```

2) Criar cliente
```
POST /clientes
Authorization: Bearer <token>
Content-Type: application/json

{ "nome": "Ana", "sobrenome": "Silva", "email": "ana@ex.com", "telefone": "(11)99999-9999" }

200 OK
{ "id": 12, "nome": "Ana", "sobrenome": "Silva", "email": "ana@ex.com", "telefone": "(11)99999-9999" }
```

3) Upload de foto
```
POST /fotos/
Authorization: Bearer <token>
Content-Type: multipart/form-data
Form fields: foto (file), cliente_id (int)

200 OK
{ "id": 7, "originalname": "meu.jpg", "filename": "abc123.jpg", "url": "http://localhost:PORT/images/abc123.jpg" }
```

---

**Próximos passos sugeridos (posso executar para você):**
- Corrigir as rotas `PUT/DELETE` que estão sem `:id` nos arquivos de rota.
- Padronizar nomes injetados pelo middleware (`req.veterinarioId`) e padronizar o formato de erro para `errors`.
- Gerar um arquivo Swagger/OpenAPI a partir desta documentação (posso criar um `openapi.yaml`).

---

Se você quiser, eu posso:
- Aplicar automaticamente as correções sugeridas nas rotas (`/clientes`, `/pets`, `/agendamentos`) e abrir um PR local.
- Gerar um arquivo `docs/API_ROUTES.md` (já criado) e/ou um `openapi.yaml` com esta especificação.

Diga qual ação prefere que eu execute a seguir.
