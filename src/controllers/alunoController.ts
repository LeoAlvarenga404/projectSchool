import { conexao } from '../database/conexao';

export const selectTodosAlunos = async (): Promise<any> => {
  const pool = await conexao();
  const result = await pool.request()
  .query('SELECT * FROM Aluno');

  return result.recordset;
};

export const selectAluno = async (cod_aluno: number): Promise<any> => {
  const pool = await conexao();
  const result = await pool.request()
  .input('COD_ALUNO', cod_aluno)
  .query('SELECT * FROM Aluno WHERE cod_aluno = @COD_ALUNO')
  
  return result.recordset
}

export const insertAluno = async (nome: string, senha: string, cod_curso: number, email: string,  data_nascimento: string, situacao_aluno: string): Promise<void> => {
  const pool = await conexao()
  await pool.request()
  .input('NOME', nome)
  .input('SENHA', senha)
  .input('COD_CURSO', cod_curso)
  .input('EMAIL', email)
  .input('DATA_NASCIMENTO',data_nascimento)
  .input('SITUACAO_ALUNO',situacao_aluno)
  .query(`
      INSERT INTO Aluno (nome, senha, cod_curso, email, data_nascimento, situacao_aluno) 
      VALUES (@NOME, @SENHA, @COD_CURSO, @EMAIL, @DATA_NASCIMENTO, @SITUACAO_ALUNO);
    `)
}



export const deleteAluno = async (cod_aluno: number): Promise<void> => {
  const pool = await conexao();
  await pool.request()
  .input('COD_ALUNO', cod_aluno)
  .query('DELETE FROM Aluno WHERE cod_aluno = @COD_ALUNO');
  
};

export const updateAluno = async (cod_aluno: number, nome?: string, senha?: string, cod_curso?: number, email?: string, data_nascimento?: string, situacao_aluno?: string): Promise<void> => {
  const pool = await conexao();
  await pool.request()
  .input('COD_ALUNO', cod_aluno)
  .input('NOME', nome)
  .input('SENHA', senha)
  .input('COD_CURSO', cod_curso)
  .input('EMAIL', email)
  .input('DATA_NASCIMENTO', data_nascimento)
  .input('SITUACAO_ALUNO', situacao_aluno)
  .query(`
    UPDATE Aluno
    SET 
      nome = COALESCE(@NOME, nome),
      senha = COALESCE(@SENHA, senha),
      cod_curso = COALESCE(@COD_CURSO, cod_curso),
      email = COALESCE(@EMAIL, email),
      data_nascimento = COALESCE(@DATA_NASCIMENTO, data_nascimento),
      situacao_aluno = COALESCE(@SITUACAO_ALUNO, situacao_aluno)
    WHERE cod_aluno = @COD_ALUNO
  `);
}

