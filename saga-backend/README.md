# PROJETO SAGA — Back-end

## Componentes da equipe
- Daniel Richard
- Eloah Veiga
- João Pedro Fagundes
- Luca Mendes
- Mateus Chaves
***
# ⚙️ SAGA — API (Back-end)

> API REST do **SAGA – Site de Análise e Gestão de Atividades**, plataforma web para registro, análise e gestão de relatórios da equipe pedagógica do SENAI.

---

# 🚀 Sobre o Back-end

A API é responsável por:

- Autenticar usuários e emitir o token de acesso (JWT) com validade de **8 horas**[cite: 11];
- Listar usuários cadastrados em rota protegida[cite: 15, 20];
- Criar e atualizar relatórios pedagógicos (`atendimento_geral` e `acompanhamento_pedagogico`)[cite: 4, 10, 14, 19];
- Gerenciar os registros no histórico com trava de edição limitada a **24 horas**[cite: 13];
- Fornecer os dados filtrados com relacionamento (`curso` e `usuario`) que alimentam os gráficos e cards do dashboard[cite: 8, 12, 25].

## Fluxo Geral

Relatório → Histórico → Dashboard → Indicadores

---

# 🗄️ Persistência e Arquitetura

A API está totalmente integrada ao banco de dados relacional **MySQL** (`tcc_saga_db`) utilizando o **Prisma ORM** (`@prisma/client` + `@prisma/adapter-mariadb`)[cite: 4, 5].

O projeto utiliza **ES Modules** (`"type": "module"`)[cite: 5] e está estruturado em camadas dentro de `src/` (`routes/`, `controllers/`, `services/`, `middleware/` e `schemas/`)[cite: 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], separando o roteamento, a validação de entrada com **Zod**, as regras de negócio e o acesso ao banco via **Prisma**[cite: 22, 23, 25, 26].

### Estrutura das Tabelas (`prisma/schema.prisma`)

- **`usuario`**: `id_usuario_pk`, `nome_completo`, `email_usu`, `senha_usu`, `preferencia_tema`, `preferencia_contraste`, `token_lembrar_me`[cite: 4].
- **`curso`**: `id_curso_pk`, `nome_curso`, `tipo_curso`[cite: 4].
- **`registro_pedagogico`**: `id_registro_pk`, `id_usuario_fk`, `id_curso_fk`, `tipo_relatorio`, `status_registro`, `turno`, `modalidade`, `data_inicial`, `data_encerramento`, `data_conclusao`, `turma`, `tipo_atendimento`, `tipo_acao`, `tipo_contratacao`, `relatorio`, `pedagogo`, `instrutor_aluno`, `coordenacao`, `docente`, `tratativa_nep`, `descricao`[cite: 4].

---

# 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
| ---------- | --- |
| Node.js | Ambiente de execução (ES Modules)[cite: 5] |
| Express (v5) | Servidor HTTP e roteamento[cite: 5] |
| Zod (v4) | Validação de schemas (`body`, `query` e `params`)[cite: 5, 7, 8, 9, 10] |
| JWT (`jsonwebtoken`) | Autenticação e controle de acesso[cite: 5, 11] |
| `bcryptjs` | Hash e comparação segura de senhas[cite: 5, 11] |
| MySQL | Banco de dados relacional[cite: 4] |
| Prisma ORM (v7) | Mapeamento objeto-relacional e consultas ao banco[cite: 4, 5] |
| Jest | Testes unitários automatizados[cite: 5] |

---

# ▶️ Como Executar

## Pré-requisitos

- Node.js (versão LTS)
- MySQL (local via XAMPP/MySQL Workbench ou em nuvem)
- Git

## Instalação

```bash
# 1. Instalar as dependências
npm install

# 2. Criar o arquivo de variáveis de ambiente a partir do exemplo
cp env.example .env

# 3. Gerar o Prisma Client e sincronizar as migrations no banco
npx prisma generate
npx prisma migrate deploy

# 4. Iniciar o servidor em modo de desenvolvimento
npm run dev
```

## Scripts Disponíveis (`package.json`)

| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | Inicia o servidor com `nodemon server.js`[cite: 5] |
| `npm start` | Inicia o servidor em produção com `node server.js`[cite: 5] |
| `npm test` | Executa a suíte de testes unitários com Jest[cite: 5] |
| `npm run test:coverage` | Executa os testes com relatório de cobertura[cite: 5] |

## Variáveis de Ambiente

| Variável | Descrição |
| -------- | --------- |
| `PORT` | Porta em que a API irá rodar (padrão: `3000`)[cite: 6] |
| `JWT_SECRET` | Chave secreta usada para assinar os tokens JWT[cite: 6, 11] |
| `DATABASE_URL` | String de conexão com o MySQL (`mysql://usuario:senha@localhost:3306/tcc_saga_db`)[cite: 6] |
| `DB_HOST` | Host do servidor MySQL (ex.: `localhost`)[cite: 6] |
| `DB_USER` | Usuário do banco MySQL (ex.: `root`)[cite: 6] |
| `DB_PASSWORD` | Senha do banco MySQL[cite: 6] |
| `DB_NAME` | Nome do banco de dados (`tcc_saga_db`)[cite: 6] |
| `DB_PORT` | Porta do MySQL (padrão: `3306`)[cite: 6] |

> ⚠️ Nunca envie o arquivo `.env` para o repositório. Utilize o `env.example` como modelo[cite: 6].

---

# 🔐 Autenticação e Segurança

## Como funciona

1. O usuário envia `email_usu`, `senha_usu` e opcionalmente `lembrarMe` para `POST /auth/login`[cite: 7, 11].
2. A API busca o registro no banco e compara a senha enviada com o **hash** (`senha_usu`) via `bcryptjs`[cite: 11].
3. Se estiver correta, a API gera um **token JWT** (validade de `8h`) e devolve `{ token, usuario }`[cite: 11].
4. Nas rotas privadas, o token deve ser enviado no header `Authorization`:
```
Authorization: Bearer <token>
```

## Definição do Payload do JWT

Quando o usuário faz login, o token JWT assinado carrega o **id** (`id_usuario_pk`) e o **email** (`email_usu`) do usuário[cite: 11]:

```json
{
  "id": 1,
  "email": "usuario@exemplo.com"
}
```

> 🔒 **A senha nunca é enviada no payload nem na resposta.** Embora seja enviada no login e comparada com o hash salvo no banco, o campo `senha_usu` é removido antes de retornar os dados públicos do usuário[cite: 11, 23].

## Tipos de Acesso

| Acesso | Significado |
| ------ | ----------- |
| 🌐 **Público** | Não exige token |
| 🔒 **Privado** | Exige token JWT válido no header `Authorization` (validado pelo `authMiddleware`)[cite: 16, 18, 19, 20, 21] |

---

# 📡 Contrato da API

## Legenda

| Item | Significado |
| ---- | ----------- |
| **Verbo** | Método HTTP da requisição |
| **Rota** | Caminho do endpoint |
| **Acesso** | Público (sem token) ou Privado (exige token) |
| **Validação com Zod** | Campos esperados e suas regras |
| **Sucesso / Falha** | Códigos HTTP retornados |

---

## 🔑 Login & Cadastro (`/auth`)

| Verbo | Rota | Acesso | Detalhes | Validação com Zod (`authSchema.js`) | Sucesso | Falha |
| ----- | ---- | ------ | -------- | ----------------------------------- | ------- | ----- |
| `POST` | `/auth/register` | 🌐 Público[cite: 16] | Registrar novo usuário no banco[cite: 11, 23] | `nome_completo` [string, obrigatório, mín. 3 caracteres]<br>`email_usu` [string, obrigatório, formato e-mail]<br>`senha_usu` [string, obrigatório, mín. 8 caracteres][cite: 7] | `201 Created` — retorna os dados públicos do usuário criado[cite: 11, 23] | `400` e `500`[cite: 11, 22] |
| `POST` | `/auth/login` | 🌐 Público[cite: 16] | Autenticação de usuário, geração de JWT (`8h`) e atualização opcional de `token_lembrar_me`[cite: 11] | `email_usu` [string, obrigatório, formato e-mail]<br>`senha_usu` [string, obrigatório]<br>`lembrarMe` [boolean, opcional][cite: 7] | `200 OK` — retorna `{ token, usuario }`[cite: 11] | `400`, `401` e `500`[cite: 11, 22] |
| `POST` | `/auth/logout` | 🔒 Privado[cite: 16] | Finalizar a sessão do usuário (adiciona o token à blacklist em memória)[cite: 11, 23] | **Header `Authorization`**: `Bearer <token>` [obrigatório][cite: 11, 21] | `200 OK`[cite: 11] | `401` e `500`[cite: 11, 21] |

---

## 👤 Usuários (`/usuarios`)

| Verbo | Rota | Acesso | Detalhes | Validação | Sucesso | Falha |
| ----- | ---- | ------ | -------- | --------- | ------- | ----- |
| `GET` | `/usuarios` | 🔒 Privado[cite: 20] | Listar todos os usuários cadastrados (`id_usuario_pk`, `nome_completo`, `email_usu`, `preferencia_tema`, `preferencia_contraste`)[cite: 23] | **Header `Authorization`**: `Bearer <token>` [obrigatório][cite: 20, 21] | `200 OK` — retorna `{ sucesso, quantidade, dados }`[cite: 15] | `401` e `500`[cite: 15, 21] |

---

## 📋 Tela de Relatório (`/relatorio`)

| Verbo | Rota | Acesso | Detalhes | Validação com Zod (`relatorioSchema.js`) | Sucesso | Falha |
| ----- | ---- | ------ | -------- | ---------------------------------------- | ------- | ----- |
| `POST` | `/relatorio/registro_pedagogico` | 🔒 Privado[cite: 19] | Criar novo registro pedagógico (injeta automaticamente `id_usuario_fk` do token se não enviado)[cite: 14, 26] | **Obrigatórios:**<br>`tipo_relatorio` [`atendimento_geral` \| `acompanhamento_pedagogico`]<br>`status_registro` [`pendente` \| `andamento`]<br>`data_inicial` [string]<br>`pedagogo` [string, 1 a 120 chars]<br>**Opcionais:** `id_usuario_fk`, `id_curso_fk`, `turno`, `modalidade`, `data_encerramento`, `turma`, `tipo_atendimento`, `tipo_acao`, `tipo_contratacao`, `relatorio`, `instrutor_aluno`, `coordenacao`, `docente`, `tratativa_nep`, `descricao`[cite: 10] | `201 Created` — retorna o registro criado[cite: 14] | `400`, `401` e `500`[cite: 14, 21, 22] |
| `PATCH` | `/relatorio/registro_pedagogico/:id` | 🔒 Privado[cite: 19] | Atualizar um relatório existente por ID (preenche `data_conclusao` automaticamente se `status_registro` mudar para `finalizado`)[cite: 14, 26] | **Param:** `id` [inteiro]<br>**Body:** todos os campos opcionais (`status_registro` aceita `pendente`, `andamento` ou `finalizado`)[cite: 10, 14] | `200 OK` — retorna o registro atualizado[cite: 14] | `400`, `401`, `404` e `500`[cite: 14, 21, 22] |

---

## 📊 Tela de Dashboard (`/dashboard`)

Todas as consultas do dashboard usam **uma única rota** com filtros combináveis via Query String. Todos os filtros são **opcionais**[cite: 8, 17].

| Verbo | Rota | Acesso | Resposta |
| ----- | ---- | ------ | -------- |
| `GET` | `/dashboard/registro_pedagogico` | 🌐 Público[cite: 17] | `200 OK` — retorna `{ sucesso, filtrosAplicados, quantidade, dados }` incluindo os dados relacionados de `curso` e `usuario`[cite: 12, 25] |

### Parâmetros de filtro (`dashboardSchemas.js`)

| Parâmetro | Tipo / Regra | Observação |
| --------- | ------------ | ---------- |
| `dataInicio` | `YYYY-MM-DD` (opcional) | Se enviado, exige que `dataFim` também seja informado[cite: 8] |
| `dataFim` | `YYYY-MM-DD` (opcional) | Obrigatório quando `dataInicio` for enviado; deve ser $\ge$ `dataInicio`[cite: 8] |
| `idCurso` | Número inteiro positivo (opcional) | Filtra pelo ID da chave estrangeira `id_curso_fk`[cite: 8, 25] |
| `curso` | String (opcional) | Filtra por nome parcial (`nome_curso`) ou ENUM (`tecnico`, `curso_de_qualificacao_aperfeicoamento_extensao`, `programas`)[cite: 8, 25] |
| `tipo` | ENUM (opcional) | Aceita `atendimento_geral` ou `acompanhamento_pedagogico`[cite: 8, 12] |

### Exemplo de requisição

```
GET /dashboard/registro_pedagogico?dataInicio=2026-01-01&dataFim=2026-03-31&tipo=atendimento_geral
```

---

## 🗂️ Tela de Histórico (`/historico`)

| Verbo | Rota | Acesso | Detalhes | Validação com Zod (`historicoSchema.js`) | Sucesso | Falha |
| ----- | ---- | ------ | -------- | ---------------------------------------- | ------- | ----- |
| `PATCH` | `/historico/registro_pedagogico/:id` | 🔒 Privado[cite: 18] | Atualizar um registro (**somente dentro de 24 horas** a partir de `data_inicial`)[cite: 13] | **Param:** `id` [inteiro positivo]<br>**Body:** campos opcionais do registro pedagógico[cite: 9] | `200 OK` — retorna o registro atualizado[cite: 13] | `400`, `401`, `403`, `404` e `500`[cite: 13, 21, 22] |
| `DELETE` | `/historico/registro_pedagogico/:id` | 🔒 Privado[cite: 18] | Excluir permanentemente um registro pedagógico por ID[cite: 13, 26] | **Param:** `id` [inteiro positivo][cite: 9] | `204 No Content`[cite: 13] | `400`, `401`, `404` e `500`[cite: 13, 21, 22] |

---

## 📌 Resumo das Rotas

| Verbo | Rota | Acesso |
| ----- | ---- | ------ |
| `POST` | `/auth/register` | 🌐 Público[cite: 16] |
| `POST` | `/auth/login` | 🌐 Público[cite: 16] |
| `POST` | `/auth/logout` | 🔒 Privado[cite: 16] |
| `GET` | `/usuarios` | 🔒 Privado[cite: 20] |
| `POST` | `/relatorio/registro_pedagogico` | 🔒 Privado[cite: 19] |
| `PATCH` | `/relatorio/registro_pedagogico/:id` | 🔒 Privado[cite: 19] |
| `GET` | `/dashboard/registro_pedagogico` | 🌐 Público[cite: 17] |
| `PATCH` | `/historico/registro_pedagogico/:id` | 🔒 Privado[cite: 18] |
| `DELETE` | `/historico/registro_pedagogico/:id` | 🔒 Privado[cite: 18] |

---

# 📏 Regras de Negócio

## Relatórios (`registro_pedagogico`)

- Na criação (`POST`), um relatório só pode ser iniciado com `status_registro` igual a **`pendente`** ou **`andamento`**[cite: 10].
- Na atualização (`PATCH`), o status pode ser alterado para **`finalizado`**, registrando automaticamente a `data_conclusao`[cite: 10, 26].
- Valores válidos de `tipo_relatorio`: `atendimento_geral` ou `acompanhamento_pedagogico`[cite: 4, 10].

## Edição no Histórico (Regra das 24 horas)

Relatórios no histórico possuem janela de edição de até **24 horas** calculada a partir de `data_inicial`[cite: 13]. Após esse período:

- ✅ Consulta permitida;
- ✅ Exclusão permitida (`DELETE`);
- ❌ Edição bloqueada (`PATCH` retorna `403 Forbidden`)[cite: 13].

## Dashboard

- Todos os filtros são opcionais e podem ser combinados livremente[cite: 8, 25].
- Se `dataInicio` for enviado, `dataFim` passa a ser **obrigatório** e deve ser igual ou posterior a `dataInicio`[cite: 8].

## Cadastro e Login

- O e-mail (`email_usu`) é único (`@unique`) no banco de dados[cite: 4, 23].
- A senha (`senha_usu`) exige no mínimo **8 caracteres**, é armazenada apenas como **hash** (`bcryptjs`) e nunca é retornada nas respostas da API ou no payload do JWT[cite: 7, 11, 23].

---

# 🚦 Códigos de Status HTTP

| Código | Nome | Quando acontece |
| ------ | ---- | --------------- |
| `200` | OK | Requisição concluída com sucesso |
| `201` | Created | Usuário ou registro pedagógico criado com sucesso[cite: 11, 14] |
| `204` | No Content | Exclusão realizada com sucesso, sem corpo na resposta[cite: 13] |
| `400` | Bad Request | Dados inválidos (falha na validação com Zod) ou chave estrangeira inexistente (`P2003`)[cite: 14, 22] |
| `401` | Unauthorized | Credenciais inválidas, ou token JWT ausente/inválido/expirado[cite: 11, 21] |
| `403` | Forbidden | Tentativa de editar um registro no histórico após o prazo de 24 horas[cite: 13] |
| `404` | Not Found | Registro pedagógico não encontrado[cite: 13, 14] |
| `500` | Internal Server Error | Erro interno no servidor[cite: 11, 12, 13, 14, 15] |

---

# 🌿 Estrutura de Branches

| Branch | Descrição |
| ------ | --------- |
| `main` | Versão principal e estável do projeto |
| `feat/*` | Branches de desenvolvimento de novas funcionalidades e integrações |

---

# 📚 Referências

1. **SENAI.** Projeto Integrador 2025/02 4.02 – Sistema de Registro e Monitoramento de Ocorrências Acadêmicas. Plataforma SAGA SENAI de Inovação, Demanda da Indústria n. 11642, 2025.
   Disponível em: <https://plataforma.gpinovacao.senai.br/plataforma/demandas-da-industria/interna/11642>
