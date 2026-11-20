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

- Autenticar usuários e emitir o token de acesso (JWT) com validade de **8 horas**;
- Listar usuários cadastrados em rota protegida;
- Criar e atualizar relatórios pedagógicos (`atendimento_geral` e `acompanhamento_pedagogico`);
- Gerenciar os registros no histórico com trava de edição limitada a **24 horas**;
- Fornecer os dados filtrados com relacionamento (`curso` e `usuario`) que alimentam os gráficos e cards do dashboard.

## Fluxo Geral

Relatório → Histórico → Dashboard → Indicadores

---

# 🗄️ Persistência e Arquitetura

A API está totalmente integrada ao banco de dados relacional **MySQL** (`tcc_saga_db`) utilizando o **Prisma ORM** (`@prisma/client` + `@prisma/adapter-mariadb`).

O projeto utiliza **ES Modules** (`"type": "module"`) e está estruturado em camadas dentro de `src/` (`routes/`, `controllers/`, `services/`, `middleware/` e `schemas/`), separando o roteamento, a validação de entrada com **Zod**, as regras de negócio e o acesso ao banco via **Prisma**.

### Estrutura das Tabelas (`prisma/schema.prisma`)

- **`usuario`**: `id_usuario_pk`, `nome_completo`, `email_usu`, `senha_usu`, `preferencia_tema`, `preferencia_contraste`, `token_lembrar_me`.
- **`curso`**: `id_curso_pk`, `nome_curso`, `tipo_curso`.
- **`registro_pedagogico`**: `id_registro_pk`, `id_usuario_fk`, `id_curso_fk`, `tipo_relatorio`, `status_registro`, `turno`, `modalidade`, `data_inicial`, `data_encerramento`, `data_conclusao`, `turma`, `tipo_atendimento`, `tipo_acao`, `tipo_contratacao`, `relatorio`, `pedagogo`, `instrutor_aluno`, `coordenacao`, `docente`, `tratativa_nep`, `descricao`.

---

# 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
| ---------- | --- |
| Node.js | Ambiente de execução (ES Modules) |
| Express (v5) | Servidor HTTP e roteamento |
| Zod (v4) | Validação de schemas (`body`, `query` e `params`) |
| JWT (`jsonwebtoken`) | Autenticação e controle de acesso |
| `bcryptjs` | Hash e comparação segura de senhas |
| MySQL | Banco de dados relacional |
| Prisma ORM (v7) | Mapeamento objeto-relacional e consultas ao banco |
| Jest | Testes unitários automatizados |

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
| `npm run dev` | Inicia o servidor com `nodemon server.js` |
| `npm start` | Inicia o servidor em produção com `node server.js` |
| `npm test` | Executa a suíte de testes unitários com Jest |
| `npm run test:coverage` | Executa os testes com relatório de cobertura |
| `npm run gerar-pdf` | Converte o relatório HTML dos testes em PDF (requer `puppeteer`, veja a seção de testes) |

## Variáveis de Ambiente

| Variável | Descrição |
| -------- | --------- |
| `PORT` | Porta em que a API irá rodar (padrão: `3000`) |
| `JWT_SECRET` | Chave secreta usada para assinar os tokens JWT |
| `DATABASE_URL` | String de conexão com o MySQL (`mysql://usuario:senha@localhost:3306/tcc_saga_db`) |
| `DB_HOST` | Host do servidor MySQL (ex.: `localhost`) |
| `DB_USER` | Usuário do banco MySQL (ex.: `root`) |
| `DB_PASSWORD` | Senha do banco MySQL |
| `DB_NAME` | Nome do banco de dados (`tcc_saga_db`) |
| `DB_PORT` | Porta do MySQL (padrão: `3306`) |

> ⚠️ Nunca envie o arquivo `.env` para o repositório. Utilize o `env.example` como modelo.

---

# 🧪 Testes Automatizados

Os testes do back-end são **testes unitários** escritos com **Jest 30** em **ES Modules**. Eles validam as regras de negócio dos `services/` (autenticação, cursos, dashboard e relatórios).

> ✅ **Não é preciso ter MySQL rodando nem arquivo `.env` para rodar os testes.** O Prisma é substituído por um banco "falso" (mock), então nada é lido ou gravado no banco real.

## Como rodar os testes

```bash
# 1. Instalar as dependências (apenas na primeira vez)
npm install

# 2. Rodar todos os testes
npm test

# 3. Rodar os testes com relatório de cobertura
npm run test:coverage
```

### Outras formas de rodar

```bash
# Rodar apenas um arquivo de teste
npm test -- src/tests/authService.test.js

# Rodar apenas os testes cujo nome contenha um trecho
npm test -- -t "logout"

# Modo observação: roda de novo a cada alteração salva
npm test -- --watch
```

> ⚠️ Use sempre `npm test` (ou `npm run test:coverage`). Rodar `npx jest` diretamente **não funciona**, porque o projeto usa ES Modules e o script do `package.json` já inclui a flag `--experimental-vm-modules` necessária.

## O que é testado

| Arquivo (`src/tests/`) | Service testado | O que valida |
| ---------------------- | --------------- | ------------ |
| `authService.test.js` | `authService` | Listagem de usuários sem a senha, cadastro (e-mail duplicado → `409`), busca por e-mail, token do "lembrar-me", logout e preferências |
| `cursoService.test.js` | `cursoService` | Listagem ordenada de cursos, busca por ID e tratamento de erro do banco |
| `dashboardService.test.js` | `dashboardService` | Filtros combináveis do dashboard (tipo, curso, enum de curso, intervalo de datas) |
| `relatorioService.test.js` | `relatorioService` | Criação, atualização (`data_conclusao` ao finalizar), exclusão e busca por ID, incluindo o erro `P2025` do Prisma |

## Como os testes funcionam

- Os arquivos ficam em `src/tests/` e terminam com `.test.js`.
- O banco falso fica em `src/tests/helpers/prismaMock.js`. Se um service passar a usar um método novo do Prisma, adicione esse método no mock.
- Cada arquivo de teste substitui o `db.js` real pelo mock **antes** de importar o service:

```js
import { jest } from '@jest/globals';
import { prismaMock } from './helpers/prismaMock.js';

jest.unstable_mockModule('../../db.js', () => ({ default: prismaMock }));

// O service deve ser importado DEPOIS do mock
const { meuService } = await import('../services/meuService.js');
```

## Relatórios gerados

| Relatório | Onde fica | Quando é gerado |
| --------- | --------- | --------------- |
| **Relatório HTML dos testes** | `relatorio/test-report.html` | A cada execução de `npm test` ou `npm run test:coverage` |
| **Cobertura de código** | `coverage/lcov-report/index.html` | Ao rodar `npm run test:coverage` |

Para ver a cobertura, abra o arquivo `coverage/lcov-report/index.html` no navegador. A cobertura considera apenas os arquivos de `src/services/`.

## Gerar o relatório em PDF

O script `gerar-pdf` transforma o `relatorio/test-report.html` em PDF usando o **Puppeteer**, que **não vem instalado por padrão**:

```bash
# 1. Instalar o Puppeteer (apenas na primeira vez)
npm install --save-dev puppeteer

# 2. Rodar os testes para gerar o relatório HTML atualizado
npm test

# 3. Gerar o PDF
npm run gerar-pdf
```

O arquivo final será salvo em `relatorio/relatorio-testes.pdf`.

---

# 🔐 Autenticação e Segurança

## Como funciona

1. O usuário envia `email_usu`, `senha_usu` e opcionalmente `lembrarMe` para `POST /auth/login`.
2. A API busca o registro no banco e compara a senha enviada com o **hash** (`senha_usu`) via `bcryptjs`.
3. Se estiver correta, a API gera um **token JWT** (validade de `8h`) e devolve `{ token, usuario }`.
4. Nas rotas privadas, o token deve ser enviado no header `Authorization`:
```
Authorization: Bearer <token>
```

## Definição do Payload do JWT

Quando o usuário faz login, o token JWT assinado carrega o **id** (`id_usuario_pk`) e o **email** (`email_usu`) do usuário:

```json
{
  "id": 1,
  "email": "usuario@exemplo.com"
}
```

> 🔒 **A senha nunca é enviada no payload nem na resposta.** Embora seja enviada no login e comparada com o hash salvo no banco, o campo `senha_usu` é removido antes de retornar os dados públicos do usuário.

## Tipos de Acesso

| Acesso | Significado |
| ------ | ----------- |
| 🌐 **Público** | Não exige token |
| 🔒 **Privado** | Exige token JWT válido no header `Authorization` (validado pelo `authMiddleware`) |

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
| `POST` | `/auth/register` | 🌐 Público | Registrar novo usuário no banco | `nome_completo` [string, obrigatório, mín. 3 caracteres]<br>`email_usu` [string, obrigatório, formato e-mail]<br>`senha_usu` [string, obrigatório, mín. 8 caracteres] | `201 Created` — retorna os dados públicos do usuário criado | `400` e `500` |
| `POST` | `/auth/login` | 🌐 Público | Autenticação de usuário, geração de JWT (`8h`) e atualização opcional de `token_lembrar_me` | `email_usu` [string, obrigatório, formato e-mail]<br>`senha_usu` [string, obrigatório]<br>`lembrarMe` [boolean, opcional] | `200 OK` — retorna `{ token, usuario }` | `400`, `401` e `500` |
| `POST` | `/auth/logout` | 🔒 Privado | Finalizar a sessão do usuário (adiciona o token à blacklist em memória) | **Header `Authorization`**: `Bearer <token>` [obrigatório] | `200 OK` | `401` e `500` |

---

## 👤 Usuários (`/usuarios`)

| Verbo | Rota | Acesso | Detalhes | Validação | Sucesso | Falha |
| ----- | ---- | ------ | -------- | --------- | ------- | ----- |
| `GET` | `/usuarios` | 🔒 Privado | Listar todos os usuários cadastrados (`id_usuario_pk`, `nome_completo`, `email_usu`, `preferencia_tema`, `preferencia_contraste`) | **Header `Authorization`**: `Bearer <token>` [obrigatório] | `200 OK` — retorna `{ sucesso, quantidade, dados }` | `401` e `500` |

---

## 📋 Tela de Relatório (`/relatorio`)

| Verbo | Rota | Acesso | Detalhes | Validação com Zod (`relatorioSchema.js`) | Sucesso | Falha |
| ----- | ---- | ------ | -------- | ---------------------------------------- | ------- | ----- |
| `POST` | `/relatorio/registro_pedagogico` | 🔒 Privado | Criar novo registro pedagógico (injeta automaticamente `id_usuario_fk` do token se não enviado) | **Obrigatórios:**<br>`tipo_relatorio` [`atendimento_geral` \| `acompanhamento_pedagogico`]<br>`status_registro` [`pendente` \| `andamento`]<br>`data_inicial` [string]<br>`pedagogo` [string, 1 a 120 chars]<br>**Opcionais:** `id_usuario_fk`, `id_curso_fk`, `turno`, `modalidade`, `data_encerramento`, `turma`, `tipo_atendimento`, `tipo_acao`, `tipo_contratacao`, `relatorio`, `instrutor_aluno`, `coordenacao`, `docente`, `tratativa_nep`, `descricao` | `201 Created` — retorna o registro criado | `400`, `401` e `500` |
| `PATCH` | `/relatorio/registro_pedagogico/:id` | 🔒 Privado | Atualizar um relatório existente por ID (preenche `data_conclusao` automaticamente se `status_registro` mudar para `finalizado`) | **Param:** `id` [inteiro]<br>**Body:** todos os campos opcionais (`status_registro` aceita `pendente`, `andamento` ou `finalizado`) | `200 OK` — retorna o registro atualizado | `400`, `401`, `404` e `500` |

---

## 📊 Tela de Dashboard (`/dashboard`)

Todas as consultas do dashboard usam **uma única rota** com filtros combináveis via Query String. Todos os filtros são **opcionais**.

| Verbo | Rota | Acesso | Resposta |
| ----- | ---- | ------ | -------- |
| `GET` | `/dashboard/registro_pedagogico` | 🌐 Público | `200 OK` — retorna `{ sucesso, filtrosAplicados, quantidade, dados }` incluindo os dados relacionados de `curso` e `usuario` |

### Parâmetros de filtro (`dashboardSchemas.js`)

| Parâmetro | Tipo / Regra | Observação |
| --------- | ------------ | ---------- |
| `dataInicio` | `YYYY-MM-DD` (opcional) | Se enviado, exige que `dataFim` também seja informado |
| `dataFim` | `YYYY-MM-DD` (opcional) | Obrigatório quando `dataInicio` for enviado; deve ser $\ge$ `dataInicio` |
| `idCurso` | Número inteiro positivo (opcional) | Filtra pelo ID da chave estrangeira `id_curso_fk` |
| `curso` | String (opcional) | Filtra por nome parcial (`nome_curso`) ou ENUM (`tecnico`, `curso_de_qualificacao_aperfeicoamento_extensao`, `programas`) |
| `tipo` | ENUM (opcional) | Aceita `atendimento_geral` ou `acompanhamento_pedagogico` |

### Exemplo de requisição

```
GET /dashboard/registro_pedagogico?dataInicio=2026-01-01&dataFim=2026-03-31&tipo=atendimento_geral
```

---

## 🗂️ Tela de Histórico (`/historico`)

| Verbo | Rota | Acesso | Detalhes | Validação com Zod (`historicoSchema.js`) | Sucesso | Falha |
| ----- | ---- | ------ | -------- | ---------------------------------------- | ------- | ----- |
| `PATCH` | `/historico/registro_pedagogico/:id` | 🔒 Privado | Atualizar um registro (**somente dentro de 24 horas** a partir de `data_inicial`) | **Param:** `id` [inteiro positivo]<br>**Body:** campos opcionais do registro pedagógico | `200 OK` — retorna o registro atualizado | `400`, `401`, `403`, `404` e `500` |
| `DELETE` | `/historico/registro_pedagogico/:id` | 🔒 Privado | Excluir permanentemente um registro pedagógico por ID | **Param:** `id` [inteiro positivo] | `204 No Content` | `400`, `401`, `404` e `500` |

---

## 📌 Resumo das Rotas

| Verbo | Rota | Acesso |
| ----- | ---- | ------ |
| `POST` | `/auth/register` | 🌐 Público |
| `POST` | `/auth/login` | 🌐 Público |
| `POST` | `/auth/logout` | 🔒 Privado |
| `GET` | `/usuarios` | 🔒 Privado |
| `POST` | `/relatorio/registro_pedagogico` | 🔒 Privado |
| `PATCH` | `/relatorio/registro_pedagogico/:id` | 🔒 Privado |
| `GET` | `/dashboard/registro_pedagogico` | 🌐 Público |
| `PATCH` | `/historico/registro_pedagogico/:id` | 🔒 Privado |
| `DELETE` | `/historico/registro_pedagogico/:id` | 🔒 Privado |

---

# 📏 Regras de Negócio

## Relatórios (`registro_pedagogico`)

- Na criação (`POST`), um relatório só pode ser iniciado com `status_registro` igual a **`pendente`** ou **`andamento`**.
- Na atualização (`PATCH`), o status pode ser alterado para **`finalizado`**, registrando automaticamente a `data_conclusao`.
- Valores válidos de `tipo_relatorio`: `atendimento_geral` ou `acompanhamento_pedagogico`.

## Edição no Histórico (Regra das 24 horas)

Relatórios no histórico possuem janela de edição de até **24 horas** calculada a partir de `data_inicial`. Após esse período:

- ✅ Consulta permitida;
- ✅ Exclusão permitida (`DELETE`);
- ❌ Edição bloqueada (`PATCH` retorna `403 Forbidden`).

## Dashboard

- Todos os filtros são opcionais e podem ser combinados livremente.
- Se `dataInicio` for enviado, `dataFim` passa a ser **obrigatório** e deve ser igual ou posterior a `dataInicio`.

## Cadastro e Login

- O e-mail (`email_usu`) é único (`@unique`) no banco de dados.
- A senha (`senha_usu`) exige no mínimo **8 caracteres**, é armazenada apenas como **hash** (`bcryptjs`) e nunca é retornada nas respostas da API ou no payload do JWT.

---

# 🚦 Códigos de Status HTTP

| Código | Nome | Quando acontece |
| ------ | ---- | --------------- |
| `200` | OK | Requisição concluída com sucesso |
| `201` | Created | Usuário ou registro pedagógico criado com sucesso |
| `204` | No Content | Exclusão realizada com sucesso, sem corpo na resposta |
| `400` | Bad Request | Dados inválidos (falha na validação com Zod) ou chave estrangeira inexistente (`P2003`) |
| `401` | Unauthorized | Credenciais inválidas, ou token JWT ausente/inválido/expirado |
| `403` | Forbidden | Tentativa de editar um registro no histórico após o prazo de 24 horas |
| `404` | Not Found | Registro pedagógico não encontrado |
| `500` | Internal Server Error | Erro interno no servidor |

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
