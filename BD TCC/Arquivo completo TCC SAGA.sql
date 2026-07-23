-- Respondendo perguntas norteadoras:
/*

Revisão da 1FN (Atomicidade): No nosso banco de dados temos uma tabela associativa chamada "usuario_curso". Nesta tabela, fazemos a ligação entre o usuário e o curso para evitar o conflito de vários usuários (N) possuem (ou estão matriculados) em vários cursos (N) diferentes.

Revisão da 2FN (Dependência Parcial): Na nossa tabela de ligação não possuimos nenhuma chave composta. Assim, fica mais tranquilo o nosso trabalho.

Revisão da 3FN (Dependência Transitiva): Todos os campos atuais de todas as nossas tabelas dependem exclusivamente das chaves primárias das respectivas tabelas.

*/

-- ====================================================================
-- 1. CRIANDO AS TABELAS + DB: REGISTRO, USUARIO, CURSO USUARIO_CURSO
-- ====================================================================

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

CREATE TABLE curso(
	id_curso_pk INT PRIMARY KEY AUTO_INCREMENT,
    nome_curso VARCHAR(100) NOT NULL,
    tipo_curso ENUM(
    'tecnico', 
    'curso_de_qualificacao_aperfeicoamento_extensao', 
    'programas'
    ) NOT NULL
);

CREATE TABLE usuario_curso(
	id_usuario_curso_pk INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario_fk INT,
    id_curso_fk INT,
    
    FOREIGN KEY(id_usuario_fk) REFERENCES usuario(id_usuario_pk),
    FOREIGN KEY(id_curso_fk) REFERENCES curso(id_curso_pk)
);

CREATE TABLE registro_pedagogico(
	id_registro_pk INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario_fk INT NOT NULL,
    id_curso_fk INT,
    
    tipo_relatorio ENUM(
		'atendimento_geral', 
		'acompanhamento_pedagogico'
    ) NOT NULL,
    
    status_registro ENUM(
		'pendente', 
		'andamento', 
		'finalizado'
    ) NOT NULL,
    
    turno ENUM(
		'manha', 
        'tarde', 
        'noite'
    ),
    
    modalidade ENUM(
		'presencial', 
        'ead', 
        'hibrido'
    ),
    
    data_inicial DATE NOT NULL,
    data_encerramento DATE NULL,
    data_conclusao TIMESTAMP,
    turma VARCHAR(30),
    
    tipo_atendimento ENUM(
		'acolhimento', 
		'acompanhamento', 
		'afastamento_temporario', 
		'advertencia', 
		'ambientacao_docente', 
		'aplicacao_de_pesquisa', 
		'apoio_a_coordenacao', 
		'atendimento_emergencial', 
		'boas_vindas', 
		'calcado_inadequado', 
		'fardamento_inadequado', 
		'intervencao_pedagogica', 
		'miniaula', 
		'na', 
		'orientacao_aluno', 
		'orientacao_reuniao_instrutora', 
		'outros', 
		'pais_resp', 
		'reuniao', 
		'visita_pedagogica'

    ),
    
    tipo_acao ENUM(
		'acompanhamento_docente_turma', 
        'docente'
    ),
    
    tipo_contratacao ENUM(
		'horista', 
        'mensalista', 
        'rsa'
    ),
    
    relatorio ENUM(
		'na', 
		'arquivado', 
		'andamento', 
		'falta_feedback', 
		'observacoes' 
    ),
    
    pedagogo VARCHAR(120),
    instrutor_aluno VARCHAR(120),
    coordenacao VARCHAR(120),
    docente VARCHAR(120),
    tratativa_nep TEXT,
    descricao TEXT,
    
    FOREIGN KEY(id_usuario_fk) REFERENCES usuario(id_usuario_pk),
    FOREIGN KEY(id_curso_fk) REFERENCES curso(id_curso_pk)
);