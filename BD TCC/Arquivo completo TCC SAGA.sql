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

INSERT INTO usuario (
    nome_completo, 
    email_usu, 
    senha_usu, 
    funcao_atual, 
    preferencia_tema, 
    preferencia_contraste, 
    token_lembrar_me
) VALUES
('Ana Clara Souza', 'ana.souza@saga.edu.br', '$2a$12$eImiTXuWVxfM37uY4JANjO', 'Pedagoga', TRUE, FALSE, NULL),
('Bruno Henrique Lima', 'bruno.lima@saga.edu.br', '$2a$12$fKmiTXuWVxfM37uY4JANjP', 'Coordenador Pedagógico', FALSE, FALSE, 'tk_bruno_9812'),
('Carla Mendes', 'carla.mendes@saga.edu.br', '$2a$12$gLmiTXuWVxfM37uY4JANjQ', 'Instrutora de TI', TRUE, TRUE, NULL),
('Diego Rodrigues', 'diego.rodrigues@saga.edu.br', '$2a$12$hMmiTXuWVxfM37uY4JANjR', 'Gerente Escolar', FALSE, FALSE, NULL),
('Eduarda Ribeiro', 'eduarda.ribeiro@saga.edu.br', '$2a$12$iNmiTXuWVxfM37uY4JANjS', 'Analista de Atendimento', TRUE, FALSE, 'tk_duda_3341'),
('Felipe Augusto Costa', 'felipe.costa@saga.edu.br', '$2a$12$jOmiTXuWVxfM37uY4JANjT', 'Instrutor de Eletrotécnica', TRUE, FALSE, NULL),
('Gabriela Santos', 'gabriela.santos@saga.edu.br', '$2a$12$kPmiTXuWVxfM37uY4JANjU', 'Orientadora Educacional', FALSE, TRUE, NULL),
('Heitor Almeida', 'heitor.almeida@saga.edu.br', '$2a$12$lQmiTXuWVxfM37uY4JANjV', 'Suporte Técnico', TRUE, FALSE, 'tk_heitor_7712'),
('Isabela Martins', 'isabela.martins@saga.edu.br', '$2a$12$mRmiTXuWVxfM37uY4JANjW', 'Assistente Administrativo', FALSE, FALSE, NULL),
('João Pedro Carvalho', 'joao.carvalho@saga.edu.br', '$2a$12$nSmiTXuWVxfM37uY4JANjX', 'Instrutor de Mecânica', TRUE, FALSE, NULL),
('Larissa Ferreira', 'larissa.ferreira@saga.edu.br', '$2a$12$oTmiTXuWVxfM37uY4JANjY', 'Supervisora Pedagógica', FALSE, TRUE, 'tk_lari_5521'),
('Lucas Oliveira', 'lucas.oliveira@saga.edu.br', '$2a$12$pUmiTXuWVxfM37uY4JANjZ', 'Instrutor de Gestão', TRUE, FALSE, NULL),
('Mariana Rocha', 'mariana.rocha@saga.edu.br', '$2a$12$qVmiTXuWVxfM37uY4JANjA', 'Psicóloga Escolar', TRUE, TRUE, NULL),
('Nicolas Pereira', 'nicolas.pereira@saga.edu.br', '$2a$12$rWmiTXuWVxfM37uY4JANjB', 'Instrutor de Robótica', FALSE, FALSE, 'tk_nico_9081'),
('Patricia Barbosa', 'patricia.barbosa@saga.edu.br', '$2a$12$sXmiTXuWVxfM37uY4JANjC', 'Secretária Acadêmica', TRUE, FALSE, NULL),
('Ricardo Alves', 'ricardo.alves@saga.edu.br', '$2a$12$tYmiTXuWVxfM37uY4JANjD', 'Coordenador de Cursos', FALSE, FALSE, NULL),
('Sofia Ramos', 'sofia.ramos@saga.edu.br', '$2a$12$uZmiTXuWVxfM37uY4JANjE', 'Pedagoga', TRUE, FALSE, 'tk_sofia_1123'),
('Tiago Fernandes', 'tiago.fernandes@saga.edu.br', '$2a$12$vAmiTXuWVxfM37uY4JANjF', 'Instrutor de Logística', FALSE, FALSE, NULL),
('Vanessa Castro', 'vanessa.castro@saga.edu.br', '$2a$12$wBmiTXuWVxfM37uY4JANjG', 'Analista NEP', TRUE, TRUE, NULL),
('William Gomes', 'william.gomes@saga.edu.br', '$2a$12$xCmiTXuWVxfM37uY4JANjH', 'Instrutor de Automação', TRUE, FALSE, 'tk_will_4401'),
('Yasmin Farias', 'yasmin.farias@saga.edu.br', '$2a$12$yDmiTXuWVxfM37uY4JANjI', 'Assistente Pedagógica', FALSE, FALSE, NULL),
('Zé Carlos Machado', 'zecarlos.machado@saga.edu.br', '$2a$12$zEmiTXuWVxfM37uY4JANjJ', 'Diretor de Ensino', TRUE, FALSE, NULL),
('Amanda Duarte', 'amanda.duarte@saga.edu.br', '$2a$12$aFmiTXuWVxfM37uY4JANjK', 'Instrutora de Design', FALSE, TRUE, 'tk_amanda_6631'),
('Bernardo Vieira', 'bernardo.vieira@saga.edu.br', '$2a$12$bGmiTXuWVxfM37uY4JANjL', 'Instrutor de Segurança do Trabalho', TRUE, FALSE, NULL),
('Camila Nogueira', 'camila.nogueira@saga.edu.br', '$2a$12$cHmiTXuWVxfM37uY4JANjM', 'Pedagoga', FALSE, FALSE, NULL);