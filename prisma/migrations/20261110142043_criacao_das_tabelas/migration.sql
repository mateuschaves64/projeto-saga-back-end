-- CreateTable
CREATE TABLE `curso` (
    `id_curso_pk` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_curso` VARCHAR(100) NOT NULL,
    `tipo_curso` ENUM('tecnico', 'curso_de_qualificacao_aperfeicoamento_extensao', 'programas') NOT NULL,

    PRIMARY KEY (`id_curso_pk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `registro_pedagogico` (
    `id_registro_pk` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario_fk` INTEGER NOT NULL,
    `id_curso_fk` INTEGER NULL,
    `tipo_relatorio` ENUM('atendimento_geral', 'acompanhamento_pedagogico') NOT NULL,
    `status_registro` ENUM('pendente', 'andamento', 'finalizado') NOT NULL,
    `turno` ENUM('manha', 'tarde', 'noite') NULL,
    `modalidade` ENUM('presencial', 'ead', 'hibrido') NULL,
    `data_inicial` DATE NOT NULL,
    `data_encerramento` DATE NULL,
    `data_conclusao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `turma` VARCHAR(30) NULL,
    `tipo_atendimento` ENUM('acolhimento', 'acompanhamento', 'afastamento_temporario', 'advertencia', 'ambientacao_docente', 'aplicacao_de_pesquisa', 'apoio_a_coordenacao', 'atendimento_emergencial', 'boas_vindas', 'calcado_inadequado', 'fardamento_inadequado', 'intervencao_pedagogica', 'miniaula', 'na', 'orientacao_aluno', 'orientacao_reuniao_instrutora', 'outros', 'pais_resp', 'reuniao', 'visita_pedagogica') NULL,
    `tipo_acao` ENUM('acompanhamento_docente_turma', 'docente') NULL,
    `tipo_contratacao` ENUM('horista', 'mensalista', 'rsa') NULL,
    `relatorio` ENUM('na', 'arquivado', 'andamento', 'falta_feedback', 'observacoes') NULL,
    `pedagogo` VARCHAR(120) NULL,
    `instrutor_aluno` VARCHAR(120) NULL,
    `coordenacao` VARCHAR(120) NULL,
    `docente` VARCHAR(120) NULL,
    `tratativa_nep` TEXT NULL,
    `descricao` TEXT NULL,

    INDEX `id_curso_fk`(`id_curso_fk`),
    INDEX `id_usuario_fk`(`id_usuario_fk`),
    PRIMARY KEY (`id_registro_pk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario_pk` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_completo` VARCHAR(120) NOT NULL,
    `email_usu` VARCHAR(150) NOT NULL,
    `senha_usu` VARCHAR(255) NOT NULL,
    `preferencia_tema` BOOLEAN NULL,
    `preferencia_contraste` BOOLEAN NULL,
    `token_lembrar_me` VARCHAR(255) NULL,

    UNIQUE INDEX `email_usu`(`email_usu`),
    PRIMARY KEY (`id_usuario_pk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `registro_pedagogico` ADD CONSTRAINT `registro_pedagogico_ibfk_1` FOREIGN KEY (`id_usuario_fk`) REFERENCES `usuario`(`id_usuario_pk`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `registro_pedagogico` ADD CONSTRAINT `registro_pedagogico_ibfk_2` FOREIGN KEY (`id_curso_fk`) REFERENCES `curso`(`id_curso_pk`) ON DELETE RESTRICT ON UPDATE RESTRICT;
