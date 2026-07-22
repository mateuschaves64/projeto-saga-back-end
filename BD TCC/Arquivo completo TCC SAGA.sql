-- Respondendo perguntas norteadoras:
/*

Revisão da 1FN (Atomicidade): No nosso banco de dados temos uma tabela associativa chamada "usuario_curso". Nesta tabela, fazemos a ligação entre o usuário e o curso para evitar o conflito de vários usuários (N) possuem (ou estão matriculados) em vários cursos (N) diferentes.

Revisão da 2FN (Dependência Parcial): Na nossa tabela de ligação não possuimos nenhuma chave composta. Assim, fica mais tranquilo o nosso trabalho.

Revisão da 3FN (Dependência Transitiva): Todos os campos atuais de todas as nossas tabelas dependem exclusivamente das chaves primárias das respectivas tabelas.

*/



CREATE DATABASE tcc_saga_db;

USE tcc_saga_db;

CREATE TABLE usuario(
	id_usuario_pk INT PRIMARY KEY AUTO_INCREMENT,
    nome_completo VARCHAR(120) NOT NULL,
    email_usu VARCHAR(150) UNIQUE NOT NULL,
    senha_usu VARCHAR(255) NOT NULL,
    funcao_atual VARCHAR(50) NOT NULL,
    preferencia_tema BOOLEAN,
    preferencia_contraste BOOLEAN,
    token_lembrar_me VARCHAR(255)
);