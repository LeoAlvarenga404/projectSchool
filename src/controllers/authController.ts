import { conexao } from '../database/conexao'

export const loginUsuario = async ( email: string): Promise<any> => {
  const pool = await conexao()
  const result = await pool.request()
  .input('EMAIL', email)
  .query(`
    SELECT * FROM Aluno
    WHERE email = @EMAIL
  `);

  return result.recordset[0]
}
