import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { loginUsuario } from '../controllers/authController'


export const authRoutes = async (app: FastifyInstance) => {
  
  app.post('/login', async (request, reply) => {
    try {
      const { email, senha } = request.body as { email: string, senha: string }

      if (!email || !senha) {
        return reply.status(400).send({ error: "Email e senha são obrigatórios"})
      }

      const aluno = await loginUsuario(email)

      if (!aluno) {
        return reply.status(401).send({ error: "Email ou senha inválidos"})
      }
      
      const senhaValida = await bcrypt.compare(senha, aluno.senha)

      if (!senhaValida) {
        return reply.status(401).send({ error: "Email ou senha inválidos"})
      }
     
      const token = jwt.sign({ cod_aluno: aluno.cod_aluno, email: aluno.email }, process.env.JWT_SECRET || '', {expiresIn: '1h'})

      return reply.send({ aluno, token })

    } catch(error) {
      console.error(error)
      return reply.status(500).send({ error: "Erro interno no servidor"})
    }
  })
}