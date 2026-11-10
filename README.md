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
 
* Autenticar usuários e emitir o token de acesso (JWT);
* Registrar e atualizar relatórios pedagógicos;
* Armazenar os relatórios finalizados no histórico, com edição limitada a **24 horas**;
* Fornecer os dados filtrados que alimentam os gráficos e cards do dashboard.
## Fluxo Geral
 
Relatório → Histórico → Dashboard → Indicadores
 
---
 
# 🧪 Dados Mockados
 
Nesta versão, a API trabalha com **dados mockados** (simulados), para não sobrecarregar o banco de dados durante o desenvolvimento e os testes.
 
Isso permite validar o contrato das rotas, as validações e o fluxo completo da aplicação sem depender de consultas ao banco. A persistência em **MySQL com Prisma ORM** faz parte da arquitetura do projeto.
 
<!-- CONFIRMAR: informar em qual pasta/arquivo ficam os mocks e se o Prisma já está conectado. -->
 
---
 
# 🛠️ Tecnologias Utilizadas
 
| Tecnologia | Uso |
| ---------- | --- |
| Node.js | Ambiente de execução |
| Express | Servidor e roteamento |
| Zod | Validação dos dados de entrada |
| JWT (JSON Web Token) | Autenticação e controle de acesso |
| bcrypt | Hash das senhas |
| MySQL | Banco de dados |
| Prisma ORM | Acesso ao banco de dados |
 
<!-- CONFIRMAR: conferir se Express, bcrypt e demais bibliotecas batem com o package.json. -->
 
---
 
# ▶️ Como Executar
 
## Pré-requisitos
 
* Node.js (versão LTS)
* Git
## Instalação
 
```bash
# 1. Instalar as dependências
npm install
 
# 2. Criar o arquivo de variáveis de ambiente
cp .env
 
# 3. Iniciar o servidor
npm run dev
```
 
## Variáveis de Ambiente
 
| Variável | Descrição |
| -------- | --------- |
| `PORT` | Porta em que a API irá rodar |
| `JWT_SECRET` | Chave secreta usada para assinar os tokens JWT |
| `DATABASE_URL` | String de conexão com o MySQL (necessária quando a integração com o banco estiver ativa) |
 
> ⚠️ Nunca envie o arquivo `.env` para o repositório.
 
<!-- CONFIRMAR: nome do arquivo de exemplo (.env.example ou env.example), scripts do package.json e variáveis realmente usadas. -->
 
---
 
# 🔐 Autenticação e Segurança
 
## Como funciona
 
1. O usuário envia e-mail e senha para `POST /auth/login`.
2. A API compara a senha enviada com o **hash** salvo no banco.
3. Se estiver correta, a API devolve um **token JWT** e os dados públicos do usuário.
4. Nas rotas privadas, o token deve ser enviado no header `Authorization`:
```
Authorization: Bearer <token>
```
 
## Definição do Payload do JWT
 
Quando o usuário faz login, a API devolve o **id** e o **e-mail** do usuário:
 
```json
{
  "id": 1,
  "email": "usuario@exemplo.com"
}
```
 
> 🔒 **A senha nunca é enviada no payload.** Embora ela seja enviada no login e comparada com o hash salvo no banco, não a devolvemos na resposta da API para que, caso alguém mal-intencionado intercepte a resposta, não consiga acesso no lugar do usuário.
 
## Tipos de Acesso
 
| Acesso | Significado |
| ------ | ----------- |
| 🌐 **Público** | Não exige token |
| 🔒 **Privado** | Exige token JWT válido no header `Authorization` |
 
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
 
## 🔑 Login & Cadastro
 
| Verbo | Rota | Acesso | Detalhes | Validação com Zod | Sucesso | Falha |
| ----- | ---- | ------ | -------- | ----------------- | ------- | ----- |
| `POST` | `/auth/login` | 🌐 Público | Autenticação de usuário e geração de token de acesso (JWT) | **E-mail** [obrigatório, formato e-mail]<br>**Senha** [obrigatório, formato senha] | `200 OK` — retorna o token e os dados públicos do usuário | `400`, `401` e `500` |
| `POST` | `/auth/register` | 🌐 Público | Registrar novo usuário no site | **E-mail** [obrigatório, formato e-mail]<br>**Senha** [obrigatório, formato senha]<br>**Nome completo** [obrigatório, formato nome] | `201 Created` | `400`, `500` e `409 Conflict` (tentativa de cadastrar um e-mail que já existe no banco) |
| `POST` | `/auth/logout` | 🔒 Privado | Finalizar a sessão do usuário (invalidação do token de sessão) | **Token** [tipo string, obrigatório, enviado no header `Authorization`] | `200 OK` ou `204 No Content` | `401 Unauthorized` ou `500` |
 
---
 
## 📋 Tela de Relatório
 
| Verbo | Rota | Acesso | Detalhes | Validação com Zod | Sucesso | Falha |
| ----- | ---- | ------ | -------- | ----------------- | ------- | ----- |
| `POST` | `/relatorio/registro_pedagogico` | 🔒 Privado | Criar novo relatório | Checar o modelo lógico conforme o tipo de relatório para ver os campos enviados.<br>Válido apenas para relatórios com o status **"Pendente"** ou **"Em andamento"**. | `201 Created` | `400`, `401` e `500` |
| `PATCH` | `/relatorio/registro_pedagogico/:id` | 🔒 Privado | Atualizar um relatório | Checar os campos enviados conforme o tipo de dado | `200 OK` | `400`, `404`, `401` e `500` |
 
---
 
## 📊 Tela de Dashboard
 
Todas as consultas do dashboard usam **uma única rota**. O que muda é a combinação de filtros enviada. Todos os filtros são **opcionais**.
 
| Verbo | Rota | Acesso |
| ----- | ---- | ------ |
| `GET` | `/dashboard/registro_pedagogico` | 🌐 Público |
 
### Combinações de filtros
 
| Busca por | Validação com Zod | Sucesso | Falha |
| --------- | ----------------- | ------- | ----- |
| **Data inicial e final** | **Data inicial** [tipo date, opcional]<br>**Data final** [tipo date, opcional, mas **obrigatória** se `dataInicio` for enviado] | `200 OK` | `400` e `500` |
| **Curso** | **Curso** [tipo ENUM, opcional] | `200 OK` | `400` e `500` |
| **Tipo de relatório** | **Tipo de relatório** [tipo ENUM (`A`, `B`), opcional] | `200 OK` | `400` e `500` |
| **Data e curso** | **Data inicial** [tipo date, opcional]<br>**Data final** [tipo date, opcional, mas obrigatória se `dataInicio` for enviado]<br>**Curso** [tipo ENUM, opcional] | `200 OK` | `400` e `500` |
| **Data e tipo de relatório** | **Data inicial** [tipo date, opcional]<br>**Data final** [tipo date, opcional, mas obrigatória se `dataInicio` for enviado]<br>**Tipo de relatório** [tipo ENUM (`A`, `B`), opcional] | `200 OK` | `400` e `500` |
| **Curso e tipo de relatório** | **Curso** [tipo ENUM, opcional]<br>**Tipo de relatório** [tipo ENUM (`A`, `B`), opcional] | `200 OK` | `400` e `500` |
 
### Exemplo de requisição
 
```
GET /dashboard/registro_pedagogico?dataInicio=2026-01-01&dataFim=2026-03-31
```
 
<!-- CONFIRMAR: nomes exatos dos parâmetros de query (dataInicio, dataFim, curso, tipo...) e os valores do ENUM de curso. -->
 
---
 
## 🗂️ Tela de Histórico
 
| Verbo | Rota | Acesso | Detalhes | Validação com Zod | Sucesso | Falha |
| ----- | ---- | ------ | -------- | ----------------- | ------- | ----- |
| `PATCH` | `/historico/registro_pedagogico/:id` | 🔒 Privado | Atualizar um relatório (**dentro de 24 horas**) | Checar os campos enviados conforme o tipo de dado | `200 OK` | `400`, `401`, `404` e `500` |
| `DELETE` | `/historico/registro_pedagogico/:id` | 🔒 Privado | Apagar um registro pedagógico por ID. O `id` é recebido via parâmetro de URL (`req.params.id`) | **ID do registro** [tipo inteiro, obrigatório] | `204 No Content` | `401`, `404` e `500` |
 
---
 
## 📌 Resumo das Rotas
 
| Verbo | Rota | Acesso |
| ----- | ---- | ------ |
| `POST` | `/auth/login` | 🌐 Público |
| `POST` | `/auth/register` | 🌐 Público |
| `POST` | `/auth/logout` | 🔒 Privado |
| `POST` | `/relatorio/registro_pedagogico` | 🔒 Privado |
| `PATCH` | `/relatorio/registro_pedagogico/:id` | 🔒 Privado |
| `GET` | `/dashboard/registro_pedagogico` | 🌐 Público |
| `PATCH` | `/historico/registro_pedagogico/:id` | 🔒 Privado |
| `DELETE` | `/historico/registro_pedagogico/:id` | 🔒 Privado |
 
---
 
# 📏 Regras de Negócio
 
## Relatórios
 
* Um relatório só pode ser **criado** com o status **"Pendente"** ou **"Em andamento"**.
* Ao ser finalizado (**"Concluído"**), o relatório é enviado ao **histórico**.
## Edição no Histórico (regra das 24 horas)
 
Relatórios concluídos podem ser editados por até **24 horas** no histórico. Após esse período:
 
* ✅ Visualização permitida;
* ✅ Exclusão permitida;
* ❌ Edição bloqueada.
## Dashboard
 
* Todos os filtros são opcionais e podem ser combinados.
* Se a **data inicial** for enviada, a **data final** passa a ser **obrigatória**.
* O **tipo de relatório** aceita apenas os valores `Atendimento Geral` ou `Acompanhamento Pedagógico`.
## Cadastro e Login
 
* O e-mail deve ser **único**: tentar cadastrar um e-mail já existente retorna `409 Conflict`.
* A senha é salva apenas como **hash**, nunca em texto puro.
* A senha **nunca** é devolvida em respostas da API nem incluída no payload do token.
---
 
# 🚦 Códigos de Status HTTP
 
| Código | Nome | Quando acontece |
| ------ | ---- | --------------- |
| `200` | OK | Requisição concluída com sucesso |
| `201` | Created | Recurso criado com sucesso |
| `204` | No Content | Sucesso, sem conteúdo na resposta (ex.: exclusão) |
| `400` | Bad Request | Dados inválidos (falha na validação com Zod) |
| `401` | Unauthorized | Credenciais inválidas, ou token ausente/inválido/expirado |
| `404` | Not Found | Registro não encontrado |
| `409` | Conflict | Conflito de dados (ex.: e-mail já cadastrado) |
| `500` | Internal Server Error | Erro interno no servidor |
 
---
 
# 🌿 Estrutura de Branches
 
| Branch | Descrição |
| ------ | --------- |
| `main` | Versão principal do projeto |
 
<!-- CONFIRMAR: branches do repositório do back-end. -->
 
---
 
# 📚 Referências
 
1. **SENAI.** Projeto Integrador 2025/02 4.02 – Sistema de Registro e Monitoramento de Ocorrências Acadêmicas. Plataforma SAGA SENAI de Inovação, Demanda da Indústria n. 11642, 2025.
   Disponível em: <https://plataforma.gpinovacao.senai.br/plataforma/demandas-da-industria/interna/11642>
 