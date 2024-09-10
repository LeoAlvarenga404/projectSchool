CREATE TABLE Curso (
    Cod_curso INT PRIMARY KEY IDENTITY(1,1),
    Nome_curso VARCHAR(100) NOT NULL
);

CREATE TABLE Disciplina (
    Cod_disciplina INT PRIMARY KEY IDENTITY(1,1),
    Nome_disciplina VARCHAR(100) NOT NULL,
    Cod_curso INT NOT NULL,
    CONSTRAINT FK_Disciplina_Curso FOREIGN KEY (Cod_curso) REFERENCES Curso(Cod_curso)
);

CREATE TABLE Aluno (
    cod_aluno INT PRIMARY KEY IDENTITY(1,1),
    nome VARCHAR(100) NOT NULL,
    cod_curso INT NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    data_inscricao DATE NOT NULL DEFAULT GETDATE(), 
    situacao_aluno VARCHAR(20) CHECK (situacao_aluno IN ('Matriculado', 'Finalizado', 'Evasão')) NOT NULL,
    CONSTRAINT FK_Aluno_Curso FOREIGN KEY (cod_curso) REFERENCES Curso(cod_curso)
);

CREATE TABLE Turma (
    cod_turma INT PRIMARY KEY IDENTITY(1,1),
    nome_turma VARCHAR(100) NOT NULL,
    cod_disciplina INT NOT NULL,
    semestre VARCHAR(10) NOT NULL,
    CONSTRAINT FK_Turma_Disciplina FOREIGN KEY (Cod_disciplina) REFERENCES Disciplina(Cod_disciplina)
);

