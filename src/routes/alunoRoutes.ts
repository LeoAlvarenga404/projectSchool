import { FastifyInstance } from 'fastify';
import { selectTodosAlunos, insertAluno, deleteAluno, updateAluno, selectAluno, loginUsuario } from '../controllers/alunoController';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import { z } from 'zod';

const alunoSchema = z.object({
  nome: z.string().min(1),
  senha: z.string().min(4, 'A senha precisa ter mais de 4 caracters'),
  cod_curso: z.number().int().min(1),
  email: z.string().email('Email inválido'),
  data_nascimento: z.string().refine(val => Date.parse(val)),
  situacao_aluno: z.string().min(1)
});


export const alunoRoutes = async (app: FastifyInstance) => {
  app.get('/alunos', async (req, reply) => {
      const alunos = await selectTodosAlunos();
      reply.send(alunos);
  });

  app.get('/alunos/:id', async (req, reply) => {
    const params = req.params as { id: string };
    const cod_aluno = parseInt(params.id, 10);

    if (!cod_aluno) {
      return reply.status(400).send({ error: 'ID inválido'})
    }

    const aluno = await selectAluno(cod_aluno)
    reply.send(aluno[0])
  })

  app.post('/alunos', async (req, reply) => {
    const pasrseBody = alunoSchema.parse(req.body);
    
    const senhaCriptografada = await bcrypt.hash(pasrseBody.senha, 10)
    
    
    await insertAluno(
      pasrseBody.nome,
      pasrseBody.senha = senhaCriptografada,
      pasrseBody.cod_curso,
      pasrseBody.email,
      pasrseBody.data_nascimento,
      pasrseBody.situacao_aluno
    );

    reply.status(201).send({ message: "Aluno criado com sucesso!" })
  });

  app.delete('/alunos/:id', async (req, reply) => {
   
      const params = req.params as unknown as { cod_aluno: string };
      const cod_aluno = parseInt(params.cod_aluno, 10);

      if (!cod_aluno) {
        return reply.status(400).send({ error: 'ID inválido' });
      }

      await deleteAluno(cod_aluno);
      reply.status(200).send({ message: 'Aluno removido com sucesso' });
  });

  app.put('/alunos/:id', async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const id = parseInt(params.id, 10);

      if (!id) {
        return reply.status(400).send({ error: 'ID inválido' });
      }

      const parsedBody = alunoSchema.parse(request.body);
 

      await updateAluno(
        id,
        parsedBody.nome,
        parsedBody.senha,
        parsedBody.cod_curso,
        parsedBody.email,
        parsedBody.data_nascimento,
        parsedBody.situacao_aluno
      );

      reply.status(200).send({ message: "Aluno atualizado com sucesso", parsedBody });
    } catch (error) {
      console.error(error)
    }
  });


  app.post('/login', async (request, reply) => {
    try {
      const { email, senha } = request.body as { email: string, senha: string }

      if (!email || !senha) {
        return reply.status(400).send({ error: "Email e senha são obrigatórios"})
      }

      const aluno = await loginUsuario(
        email,
        senha
      )

      const senhaValida = await bcrypt.compare(senha, aluno.senha)
      if (!aluno && !senhaValida) {
        return reply.status(401).send({ error: "Email ou senha inválidos"})
      }
      
      const token = jwt.sign({ cod_aluno: aluno.cod_aluno, email: aluno.email }, process.env.JWT_SECRET || '', {expiresIn: '1h'})

      return reply.send({ aluno, token })

    } catch(error) {
      console.error(error)
    }
  })

}

