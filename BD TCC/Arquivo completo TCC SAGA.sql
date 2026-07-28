							-- ====================================================================
														-- 1. ETAPA
							-- ====================================================================
/*

-- Respondendo perguntas norteadoras:

Revisão da 1FN (Atomicidade): No nosso banco de dados temos uma tabela associativa chamada "usuario_curso". Nesta tabela, fazemos a ligação entre o usuário e o curso para evitar o conflito de vários usuários (N) possuem (ou estão matriculados) em vários cursos (N) diferentes.

Revisão da 2FN (Dependência Parcial): Na nossa tabela de ligação não possuimos nenhuma chave composta. Assim, fica mais tranquilo o nosso trabalho.

Revisão da 3FN (Dependência Transitiva): Todos os campos atuais de todas as nossas tabelas dependem exclusivamente das chaves primárias das respectivas tabelas.

*/

							-- ====================================================================
														-- 1.1 OBS
							-- ====================================================================

-- RELATÓRIO 3 NÃO SERÁ REALIZADO

/* 
Durante a criação e povoamento do banco de dados, tivemos o registro apenas de três tabelas principais que compoem o nosso sistema.
O nosso sistema conta apenas com três tabelas principais, uma de cursos ofertados pela unidade onde o sistema é destinado a operação, uma segunda, ligada a primeira com
registros pedagógicos da unidade, com operações da unidade, como entrevistas, ocorrências e etc, e uma terceira, ligada a segunda com os registros de usuários desse sistema.
Por isso, não foi possível realizar o terceiro relatório com o JOIN de 4 (ou mais) tabelas.
*/	


/*
                  Tabela/Legenda

          AZUL: Pertence a tabela em si;
          AMARELO: Atendimento Geral;
      AMARELO E VERDE Acompanhamento Pédagógico;

================================================
  -- AZUL: Pertence a tabela em si:

      id_registro_pk
      id_usuario_fk
      id_curso_fk
      tipo_relatorio
      data_conclusao
================================================

================================================
  -- AAMARELO: Atendimento Geral:

      status_registro
      turno
      modalidade
      data_inicial
      data_encerramento
      turma
      tipo_atendimento
      pedagogo
      instrutor_aluno
      coordenacao
      tratativa_nep
      descricao
================================================

================================================
  -- AMARELO E VERDE Acompanhamento Pédagógico:

      tipo_acao
      tipo_contratacao
      relatorio
      docente
================================================

*/

							-- ====================================================================
														-- 2. ETAPA
							-- ====================================================================



-- ====================================================================
-- 2.1 CRIANDO AS TABELAS + DB: REGISTRO, USUARIO, CURSO USUARIO_CURSO
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
	id_registro_pk INT PRIMARY KEY AUTO_INCREMENT, -- AZUL
    id_usuario_fk INT NOT NULL, -- AZUL
    id_curso_fk INT, -- AZUL
    
    tipo_relatorio ENUM( -- AZUL
		'atendimento_geral', 
		'acompanhamento_pedagogico'
    ) NOT NULL,
    
    status_registro ENUM( -- AMARELO
		'pendente', 
		'andamento', 
		'finalizado'
    ) NOT NULL,
    
    turno ENUM( -- AMARELO
		'manha', 
        'tarde', 
        'noite'
    ),
    
    modalidade ENUM( -- AMARELO
		'presencial', 
        'ead', 
        'hibrido'
    ),
    
    data_inicial DATE NOT NULL, -- AMARELO
    data_encerramento DATE NULL, -- AMARELO
    data_conclusao TIMESTAMP, -- AZUL

    turma VARCHAR(30), -- AMARELO
    
    tipo_atendimento ENUM( -- AMARELO
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
    
    tipo_acao ENUM( -- VERDE
		'acompanhamento_docente_turma', 
        'docente'
    ),
    
    tipo_contratacao ENUM( -- VERDE
		'horista', 
        'mensalista', 
        'rsa'
    ),
    
    relatorio ENUM( -- VERDE
		'na', 
		'arquivado', 
		'andamento', 
		'falta_feedback', 
		'observacoes' 
    ),
    
    pedagogo VARCHAR(120), -- AMARELO
    instrutor_aluno VARCHAR(120), -- AMARELO
    coordenacao VARCHAR(120), -- AMARELO

    docente VARCHAR(120), -- VERDE

    tratativa_nep TEXT, -- AMARELO
    descricao TEXT, -- AMARELO
    
    FOREIGN KEY(id_usuario_fk) REFERENCES usuario(id_usuario_pk), -- AZUL
    FOREIGN KEY(id_curso_fk) REFERENCES curso(id_curso_pk) -- AZUL
);


							-- ====================================================================
														-- 3. ETAPA
							-- ====================================================================
                            
                            
-- ==========================================
-- 3.1 POVOANDO A TABELA CURSO (CATÁLOGO)
-- ==========================================

INSERT INTO curso (nome_curso, tipo_curso) VALUES

-- ==========================
-- CURSOS TÉCNICOS
-- ==========================
('Técnico de/em Eletromecânica', 'tecnico'),
('Técnico em Administração', 'tecnico'),
('Técnico em Automação / Automação Industrial', 'tecnico'),
('Técnico em Desenvolvimento de Sistemas / Sistema', 'tecnico'),
('Técnico em Edificações', 'tecnico'),
('Técnico em Eletrotécnica', 'tecnico'),
('Técnico em Informática / Informática para Internet', 'tecnico'),
('Técnico em Logística', 'tecnico'),
('Técnico em Manutenção Automotiva / Automotiva', 'tecnico'),
('Técnico em Planejamento e Controle da Produção / EAD', 'tecnico'),
('Técnico em Qualidade', 'tecnico'),
('Técnico em Segurança do Trabalho', 'tecnico'),

-- ==========================================================
-- CURSOS DE QUALIFICAÇÃO, APERFEIÇOAMENTO E EXTENSÃO
-- ==========================================================
('Agente de Gestão de Resíduos Sólidos Industriais e Urbanos', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Almoxarife', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Aperfeiçoamento em Caldeiraria Industrial', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Assistente Administrativo / Assistente ADM', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Assistente de Logística', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Assistente de Production', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Auxiliar de Linha de Produção Para a Indústria de Pneus', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Auxiliar de Produção', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Controlador Lógico Programável', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Eletricista Industrial', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Funileiro Automotivo', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Instalação e Manutenção de Condicionadores Ar Split System', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Instalação, Operação e Manutenção em Carregadores de Veículos Elétricos', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Mecânico de Manutenção de Máquinas Industriais', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Montador de Andaimes / Andaime', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Operação de Empilhadeira Elétrica', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Operador de Microcomputador e Informática', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Operador de Processos Industriais', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Operador de Produção Veicular', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Pintura', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Planejamento e Controle da Produção', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Segurança em Eletricidade – NR 10 – Básico', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Ser Jovem', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Soldador por Eletrodo Revestido de Estruturas e Tubulações', 'curso_de_qualificacao_aperfeicoamento_extensao'),
('Soldagem MIG/MAG de Estruturas Metálicas', 'curso_de_qualificacao_aperfeicoamento_extensao'),

-- ==========================
-- PROGRAMAS
-- ==========================
('BYD', 'programas'),
('LauroQualifica', 'programas'),
('TI', 'programas');


-- ==========================================
-- 3.2 POVOANDO A TABELA USUÁRIO
-- ==========================================

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


-- ==========================================
-- 3.3 POVOANDO A TABELA REGISTRO_PEDAGOGICO
-- ==========================================

INSERT INTO registro_pedagogico (
    id_usuario_fk,
    id_curso_fk,
    tipo_relatorio,
    status_registro,
    turno,
    modalidade,
    data_inicial,
    data_encerramento,
    data_conclusao,
    turma,
    tipo_atendimento,
    tipo_acao,
    tipo_contratacao,
    relatorio,
    pedagogo,
    instrutor_aluno,
    coordenacao,
    docente,
    tratativa_nep,
    descricao
) VALUES



-- ATENDIMENTO GERAL

(1,4,'atendimento_geral','finalizado','manha','presencial',
'2025-02-03','2025-02-03','2025-02-03 11:30:00',
'TDS-2501','acolhimento',
NULL,NULL,NULL,
'Sofia Ramos','João Pedro Carvalho','Ricardo Alves',NULL,
'Aluno orientado quanto às normas institucionais.',
'Acolhimento realizado no primeiro dia de aula.'),

(2,8,'atendimento_geral','andamento','noite','presencial',
'2025-02-12',NULL,NULL,
'LOG-2502','acompanhamento',
NULL,NULL,NULL,
'Camila Nogueira','Tiago Fernandes','Bruno Henrique Lima',NULL,
'Acompanhamento periódico do rendimento.',
'Aluno apresentou dificuldade em atividades práticas.'),

(3,11,'atendimento_geral','finalizado','tarde','ead',
'2025-03-01','2025-03-02','2025-03-02 17:00:00',
'QLD-2501','orientacao_aluno',
NULL,NULL,NULL,
'Ana Clara Souza','Lucas Oliveira','Ricardo Alves',NULL,
'Orientações sobre frequência e avaliações.',
'Aluno compreendeu as orientações.'),

(4,2,'atendimento_geral','pendente','manha','presencial',
'2025-03-05',NULL,NULL,
'ADM-2503','pais_resp',
NULL,NULL,NULL,
'Sofia Ramos','Lucas Oliveira','Larissa Ferreira',NULL,
'Aguardando retorno do responsável.',
'Necessária reunião com familiares.'),

(5,6,'atendimento_geral','finalizado','tarde','hibrido',
'2025-03-10','2025-03-10','2025-03-10 15:45:00',
'ELT-2502','advertencia',
NULL,NULL,NULL,
'Camila Nogueira','Felipe Costa','Bruno Henrique Lima',NULL,
'Advertência registrada devido a comportamento inadequado.',
'Aluno assinou ciência.'),

(6,9,'atendimento_geral','andamento','manha','presencial',
'2025-03-15',NULL,NULL,
'MEC-2501','intervencao_pedagogica',
NULL,NULL,NULL,
'Ana Clara Souza','João Pedro Carvalho','Ricardo Alves',NULL,
'Plano de intervenção iniciado.',
'Será acompanhado nas próximas semanas.'),

(7,12,'atendimento_geral','finalizado','noite','presencial',
'2025-03-20','2025-03-20','2025-03-20 21:00:00',
'SEG-2501','reuniao',
NULL,NULL,NULL,
'Sofia Ramos','Bernardo Vieira','Larissa Ferreira',NULL,
'Reunião realizada com sucesso.',
'Definidas ações preventivas.'),

(8,5,'atendimento_geral','pendente','tarde','ead',
'2025-04-01',NULL,NULL,
'EDF-2502','visita_pedagogica',
NULL,NULL,NULL,
'Camila Nogueira','Amanda Duarte','Ricardo Alves',NULL,
'Visita agendada.',
'Aguardando execução.'),

(9,1,'atendimento_geral','finalizado','manha','presencial',
'2025-04-04','2025-04-04','2025-04-04 10:20:00',
'ELM-2501','boas_vindas',
NULL,NULL,NULL,
'Ana Clara Souza','William Gomes','Bruno Henrique Lima',NULL,
'Recepção aos novos estudantes.',
'Integração concluída.'),

(10,3,'atendimento_geral','andamento','tarde','hibrido',
'2025-04-10',NULL,NULL,
'AUT-2502','orientacao_reuniao_instrutora',
NULL,NULL,NULL,
'Sofia Ramos','William Gomes','Ricardo Alves',NULL,
'Reunião realizada com instrutor.',
'Monitoramento em andamento.'),

(11,7,'atendimento_geral','finalizado','noite','presencial',
'2025-04-15','2025-04-15','2025-04-15 20:40:00',
'INF-2501','fardamento_inadequado',
NULL,NULL,NULL,
'Camila Nogueira','Carla Mendes','Larissa Ferreira',NULL,
'Orientação referente ao uniforme.',
'Aluno regularizou a situação.'),

(12,10,'atendimento_geral','finalizado','manha','ead',
'2025-04-20','2025-04-20','2025-04-20 11:15:00',
'PCP-2501','calcado_inadequado',
NULL,NULL,NULL,
'Ana Clara Souza','Lucas Oliveira','Ricardo Alves',NULL,
'Orientado sobre uso correto de EPIs.',
'Caso encerrado.'),

(13,15,'atendimento_geral','andamento','tarde','presencial',
'2025-05-02',NULL,NULL,
'ASS-2503','atendimento_emergencial',
NULL,NULL,NULL,
'Sofia Ramos','Lucas Oliveira','Bruno Henrique Lima',NULL,
'Atendimento imediato prestado.',
'Necessário novo acompanhamento.'),

(14,18,'atendimento_geral','pendente','noite','presencial',
'2025-05-08',NULL,NULL,
'OPI-2502','afastamento_temporario',
NULL,NULL,NULL,
'Camila Nogueira','Nicolas Pereira','Ricardo Alves',NULL,
'Aguardando documentação.',
'Afastamento solicitado.'),

(15,20,'atendimento_geral','finalizado','manha','hibrido',
'2025-05-14','2025-05-14','2025-05-14 09:40:00',
'OPV-2501','apoio_a_coordenacao',
NULL,NULL,NULL,
'Ana Clara Souza','João Pedro Carvalho','Larissa Ferreira',NULL,
'Apoio realizado à coordenação.',
'Demanda solucionada.'),

(16,22,'atendimento_geral','andamento','tarde','presencial',
'2025-05-20',NULL,NULL,
'NR10-2502','aplicacao_de_pesquisa',
NULL,NULL,NULL,
'Sofia Ramos','Bernardo Vieira','Ricardo Alves',NULL,
'Pesquisa aplicada aos estudantes.',
'Resultados em análise.'),

(17,24,'atendimento_geral','finalizado','noite','presencial',
'2025-06-02','2025-06-02','2025-06-02 21:10:00',
'SOLD-2501','miniaula',
NULL,NULL,NULL,
'Camila Nogueira','João Pedro Carvalho','Bruno Henrique Lima',NULL,
'Miniaula de reforço aplicada.',
'Melhora observada.'),

(18,26,'atendimento_geral','pendente','manha','ead',
'2025-06-05',NULL,NULL,
'MIG-2502','outros',
NULL,NULL,NULL,
'Ana Clara Souza','Felipe Costa','Ricardo Alves',NULL,
'Caso em avaliação.',
'Aguardando definição.'),

(19,14,'atendimento_geral','finalizado','tarde','presencial',
'2025-06-10','2025-06-10','2025-06-10 16:20:00',
'ALM-2501','reuniao',
NULL,NULL,NULL,
'Sofia Ramos','Lucas Oliveira','Larissa Ferreira',NULL,
'Reunião pedagógica realizada.',
'Encaminhamentos definidos.'),

(20,16,'atendimento_geral','andamento','noite','hibrido',
'2025-06-18',NULL,NULL,
'AUX-2503','orientacao_aluno',
NULL,NULL,NULL,
'Camila Nogueira','William Gomes','Ricardo Alves',NULL,
'Aluno recebeu orientações acadêmicas.',
'Acompanhamento continuará.'),

(21,13,'atendimento_geral','finalizado','manha','presencial',
'2025-07-01','2025-07-01','2025-07-01 11:00:00',
'AGR-2501','acolhimento',
NULL,NULL,NULL,
'Ana Clara Souza','Lucas Oliveira','Bruno Henrique Lima',NULL,
'Recepção institucional realizada.',
'Integração satisfatória.'),

(22,17,'atendimento_geral','pendente','tarde','presencial',
'2025-07-08',NULL,NULL,
'CLP-2501','acompanhamento',
NULL,NULL,NULL,
'Sofia Ramos','Nicolas Pereira','Larissa Ferreira',NULL,
'Necessário acompanhar desempenho.',
'Primeiro registro do caso.'),

(23,19,'atendimento_geral','finalizado','noite','ead',
'2025-07-15','2025-07-15','2025-07-15 20:50:00',
'MIC-2501','intervencao_pedagogica',
NULL,NULL,NULL,
'Camila Nogueira','Carla Mendes','Ricardo Alves',NULL,
'Intervenção concluída.',
'Aluno apresentou evolução.'),

(24,21,'atendimento_geral','andamento','manha','presencial',
'2025-07-20',NULL,NULL,
'PIN-2502','orientacao_reuniao_instrutora',
NULL,NULL,NULL,
'Ana Clara Souza','Amanda Duarte','Bruno Henrique Lima',NULL,
'Reunião realizada para alinhamento.',
'Novas ações definidas.'),

(25,27,'atendimento_geral','finalizado','tarde','presencial',
'2025-07-24','2025-07-24','2025-07-24 16:45:00',
'BYD-2501','visita_pedagogica',
NULL,NULL,NULL,
'Sofia Ramos','William Gomes','Larissa Ferreira',NULL,
'Visita técnica acompanhada pela equipe pedagógica.',
'Atendimento encerrado com sucesso.');



-- ACOMPANHAMENTO PEDAGÓGICO

INSERT INTO registro_pedagogico (
    id_usuario_fk,
    id_curso_fk,
    tipo_relatorio,
    status_registro,
    turno,
    modalidade,
    data_inicial,
    data_encerramento,
    data_conclusao,
    turma,
    tipo_atendimento,
    tipo_acao,
    tipo_contratacao,
    relatorio,
    pedagogo,
    instrutor_aluno,
    coordenacao,
    docente,
    tratativa_nep,
    descricao
) VALUES

(1,4,'acompanhamento_pedagogico','finalizado','manha','presencial',
'2025-08-01','2025-08-15','2025-08-15 10:45:00',
'TDS-2501',
NULL,
'acompanhamento_docente_turma','mensalista','arquivado',
'Ana Clara Souza',NULL,'Ricardo Alves',
'Carla Mendes',
'Acompanhamento realizado durante duas semanas.',
'Observação de aulas e feedback positivo ao docente.'),

(2,6,'acompanhamento_pedagogico','andamento','tarde','presencial',
'2025-08-03',NULL,NULL,
'ELT-2502',
NULL,
'docente','horista','andamento',
'Sofia Ramos',NULL,'Larissa Ferreira',
'Felipe Augusto Costa',
'Plano de acompanhamento em execução.',
'Necessário fortalecer estratégias metodológicas.'),

(3,8,'acompanhamento_pedagogico','finalizado','noite','presencial',
'2025-08-05','2025-08-18','2025-08-18 20:40:00',
'LOG-2501',
NULL,
'acompanhamento_docente_turma','mensalista','arquivado',
'Camila Nogueira',NULL,'Ricardo Alves',
'Tiago Fernandes',
'Processo concluído.',
'Turma apresentou melhora no rendimento.'),

(4,2,'acompanhamento_pedagogico','pendente','manha','ead',
'2025-08-08',NULL,NULL,
'ADM-2502',
NULL,
'docente','rsa','falta_feedback',
'Sofia Ramos',NULL,'Bruno Henrique Lima',
'Lucas Oliveira',
'Aguardando devolutiva do docente.',
'Primeiro contato realizado.'),

(5,12,'acompanhamento_pedagogico','finalizado','tarde','presencial',
'2025-08-10','2025-08-20','2025-08-20 16:00:00',
'SEG-2501',
NULL,
'acompanhamento_docente_turma','mensalista','arquivado',
'Ana Clara Souza',NULL,'Larissa Ferreira',
'Bernardo Vieira',
'Objetivos alcançados.',
'Boas práticas compartilhadas com a equipe.'),

(6,3,'acompanhamento_pedagogico','andamento','manha','hibrido',
'2025-08-12',NULL,NULL,
'AUT-2501',
NULL,
'docente','horista','observacoes',
'Camila Nogueira',NULL,'Ricardo Alves',
'William Gomes',
'Monitoramento contínuo.',
'Necessário ampliar atividades práticas.'),

(7,5,'acompanhamento_pedagogico','finalizado','tarde','presencial',
'2025-08-15','2025-08-25','2025-08-25 17:20:00',
'EDF-2501',
NULL,
'acompanhamento_docente_turma','mensalista','arquivado',
'Sofia Ramos',NULL,'Bruno Henrique Lima',
'Amanda Duarte',
'Registro encerrado.',
'Feedback satisfatório da coordenação.'),

(8,7,'acompanhamento_pedagogico','pendente','noite','ead',
'2025-08-18',NULL,NULL,
'INF-2502',
NULL,
'docente','horista','falta_feedback',
'Ana Clara Souza',NULL,'Ricardo Alves',
'Carla Mendes',
'Aguardando observação em sala.',
'Sem retorno do docente até o momento.'),

(9,9,'acompanhamento_pedagogico','finalizado','manha','presencial',
'2025-08-20','2025-09-01','2025-09-01 11:15:00',
'MEC-2501',
NULL,
'acompanhamento_docente_turma','mensalista','arquivado',
'Camila Nogueira',NULL,'Larissa Ferreira',
'João Pedro Carvalho',
'Relatório concluído.',
'Metodologia adequada ao perfil da turma.'),

(10,11,'acompanhamento_pedagogico','andamento','tarde','presencial',
'2025-08-22',NULL,NULL,
'QLD-2501',
NULL,
'docente','rsa','andamento',
'Sofia Ramos',NULL,'Ricardo Alves',
'Lucas Oliveira',
'Acompanhamento mensal.',
'Docente demonstrou evolução parcial.'),

(11,1,'acompanhamento_pedagogico','finalizado','manha','presencial',
'2025-08-25','2025-09-05','2025-09-05 10:30:00',
'ELM-2501',
NULL,
'acompanhamento_docente_turma','mensalista','arquivado',
'Ana Clara Souza',NULL,'Bruno Henrique Lima',
'William Gomes',
'Objetivos concluídos.',
'Bom relacionamento com a turma.'),

(12,10,'acompanhamento_pedagogico','andamento','noite','ead',
'2025-08-28',NULL,NULL,
'PCP-2501',
NULL,
'docente','horista','observacoes',
'Camila Nogueira',NULL,'Ricardo Alves',
'Lucas Oliveira',
'Acompanhamento remoto.',
'Necessário maior participação dos estudantes.'),

(13,15,'acompanhamento_pedagogico','pendente','manha','presencial',
'2025-09-02',NULL,NULL,
'ASS-2502',
NULL,
'docente','rsa','falta_feedback',
'Sofia Ramos',NULL,'Larissa Ferreira',
'Lucas Oliveira',
'Aguardando nova visita.',
'Registro aberto.'),

(14,17,'acompanhamento_pedagogico','finalizado','tarde','presencial',
'2025-09-04','2025-09-12','2025-09-12 15:55:00',
'CLP-2501',
NULL,
'acompanhamento_docente_turma','mensalista','arquivado',
'Ana Clara Souza',NULL,'Ricardo Alves',
'Nicolas Pereira',
'Processo concluído.',
'Excelente domínio técnico observado.'),

(15,19,'acompanhamento_pedagogico','andamento','noite','hibrido',
'2025-09-06',NULL,NULL,
'MIC-2501',
NULL,
'docente','horista','andamento',
'Camila Nogueira',NULL,'Bruno Henrique Lima',
'Carla Mendes',
'Observações em andamento.',
'Planejamento será revisado.'),

(16,20,'acompanhamento_pedagogico','finalizado','manha','presencial',
'2025-09-10','2025-09-20','2025-09-20 11:40:00',
'OPV-2501',
NULL,
'acompanhamento_docente_turma','mensalista','arquivado',
'Sofia Ramos',NULL,'Ricardo Alves',
'João Pedro Carvalho',
'Relatório encerrado.',
'Resultados positivos identificados.'),

(17,21,'acompanhamento_pedagogico','andamento','tarde','presencial',
'2025-09-15',NULL,NULL,
'PIN-2501',
NULL,
'docente','rsa','observacoes',
'Ana Clara Souza',NULL,'Larissa Ferreira',
'Amanda Duarte',
'Monitoramento contínuo.',
'Planejamento de novas intervenções.'),

(18,22,'acompanhamento_pedagogico','pendente','manha','ead',
'2025-09-18',NULL,NULL,
'NR10-2502',
NULL,
'docente','horista','falta_feedback',
'Camila Nogueira',NULL,'Ricardo Alves',
'Bernardo Vieira',
'Feedback ainda não recebido.',
'Novo contato será realizado.'),

(19,23,'acompanhamento_pedagogico','finalizado','noite','presencial',
'2025-09-22','2025-10-01','2025-10-01 21:10:00',
'SJ-2501',
NULL,
'acompanhamento_docente_turma','mensalista','arquivado',
'Sofia Ramos',NULL,'Bruno Henrique Lima',
'Lucas Oliveira',
'Encerramento do acompanhamento.',
'Turma apresentou excelente desempenho.'),

(20,24,'acompanhamento_pedagogico','andamento','manha','presencial',
'2025-09-25',NULL,NULL,
'SOLD-2502',
NULL,
'docente','horista','andamento',
'Ana Clara Souza',NULL,'Ricardo Alves',
'João Pedro Carvalho',
'Observações periódicas.',
'Necessária continuidade do acompanhamento.'),

(21,25,'acompanhamento_pedagogico','finalizado','tarde','hibrido',
'2025-10-01','2025-10-10','2025-10-10 15:40:00',
'MIG-2501',
NULL,
'acompanhamento_docente_turma','mensalista','arquivado',
'Camila Nogueira',NULL,'Larissa Ferreira',
'Felipe Augusto Costa',
'Objetivos plenamente atingidos.',
'Relatório arquivado.'),

(22,27,'acompanhamento_pedagogico','andamento','noite','presencial',
'2025-10-05',NULL,NULL,
'BYD-2501',
NULL,
'docente','rsa','observacoes',
'Sofia Ramos',NULL,'Ricardo Alves',
'William Gomes',
'Acompanhamento do programa BYD.',
'Desenvolvimento satisfatório.'),

(23,28,'acompanhamento_pedagogico','finalizado','manha','presencial',
'2025-10-10','2025-10-18','2025-10-18 10:20:00',
'LQ-2501',
NULL,
'acompanhamento_docente_turma','mensalista','arquivado',
'Ana Clara Souza',NULL,'Bruno Henrique Lima',
'Lucas Oliveira',
'Relatório concluído.',
'Boas práticas registradas.'),

(24,29,'acompanhamento_pedagogico','pendente','tarde','ead',
'2025-10-15',NULL,NULL,
'TI-2501',
NULL,
'docente','horista','falta_feedback',
'Camila Nogueira',NULL,'Ricardo Alves',
'Carla Mendes',
'Aguardando retorno da docente.',
'Registro permanece em aberto.'),

(25,13,'acompanhamento_pedagogico','finalizado','manha','presencial',
'2025-10-20','2025-10-30','2025-10-30 11:30:00',
'AGR-2501',
NULL,
'acompanhamento_docente_turma','mensalista','arquivado',
'Sofia Ramos',NULL,'Larissa Ferreira',
'Felipe Augusto Costa',
'Acompanhamento pedagógico concluído com êxito.',
'Docente demonstrou evolução metodológica e excelente interação com a turma.');


-- ==========================================
-- 3.4 SIMULAÇÃO DE ALTERAÇÃO E REMOÇÃO
-- ==========================================

-- Atualização Crítica (UPDATE)
UPDATE usuario SET preferencia_tema = FALSE WHERE id_usuario_pk = 1;
UPDATE usuario SET preferencia_contraste = TRUE WHERE id_usuario_pk = 4;

-- Exclusão Segura (DELETE)
DELETE FROM registro_pedagogico WHERE id_usuario_fk = 22;
DELETE FROM usuario WHERE id_usuario_pk = 22;

-- Como a tabela registro pedagogico possuia uma chave estrangeira referenciando a chave primaria de usuário, apagou-se primeiro a chave estrangeira armazenada em registro pedagogico para procedir com a deleção do usuario.


							-- ====================================================================
														-- 4. ETAPA
							-- ====================================================================
                            

-- ==========================================
-- 4.1 RELATÓRIO 1

/*
Traga o nome dos usuários, o tipo de curso e os dados mais importantes da tabela de registro.
OBS: Não traga valores nulos. O tipo de curso precisa ser Técnico. Ordene pelo nome do usuário em 
ordem Alfabética.
*/

-- ==========================================

SELECT 
	usuario.nome_completo,
    curso.tipo_curso,
    
    registro_pedagogico.tipo_relatorio,
    registro_pedagogico.status_registro,
    registro_pedagogico.data_inicial,
    registro_pedagogico.data_encerramento,
    registro_pedagogico.data_conclusao,
    registro_pedagogico.tratativa_nep,
    registro_pedagogico.descricao
    
FROM usuario 
	INNER JOIN registro_pedagogico
ON usuario.id_usuario_pk = registro_pedagogico.id_usuario_fk
	INNER JOIN curso 
ON curso.id_curso_pk = registro_pedagogico.id_curso_fk
WHERE curso.tipo_curso = 'tecnico' AND registro_pedagogico.data_encerramento IS NOT NULL 
ORDER BY usuario.nome_completo;

-- ==========================================
-- 4.2 RELATÓRIO 2
-- selecionar todos os usuários e os registros, tendo correspondências ou não
-- ==========================================

SELECT 
	usuario.nome_completo, 

    registro_pedagogico.tipo_relatorio,
    registro_pedagogico.status_registro,
    registro_pedagogico.data_inicial,
    registro_pedagogico.data_encerramento,
    registro_pedagogico.data_conclusao,
    registro_pedagogico.tratativa_nep,
    registro_pedagogico.descricao

FROM usuario
	LEFT JOIN registro_pedagogico 
ON usuario.id_usuario_pk = registro_pedagogico.id_usuario_fk
ORDER BY usuario.nome_completo;
