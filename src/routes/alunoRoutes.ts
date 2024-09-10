import { FastifyInstance } from 'fastify';
import { selectTodosAlunos, insertAluno, deleteAluno, updateAluno, selectAluno } from '../controllers/alunoController';
import { z } from 'zod';

const alunoSchema = z.object({
  nome: z.string().min(1),
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
    const params = req.params as unknown as { id: string };
    const cod_aluno = parseInt(params.id, 10);

    if (!cod_aluno) {
      return reply.status(400).send({ error: 'ID inválido'})
    }

    const aluno = await selectAluno(cod_aluno)
    reply.send(aluno[0])
  })

  app.post('/alunos', async (req, reply) => {
    const parsedBody = alunoSchema.parse(req.body);

    await insertAluno(
      parsedBody.nome,
      parsedBody.cod_curso,
      parsedBody.email,
      parsedBody.data_nascimento,
      parsedBody.situacao_aluno
    );

    reply.status(201).send({ message: 'Aluno criado com sucesso'})
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
      const params = request.params as unknown as { id: string };
      const id = parseInt(params.id, 10);
      if (isNaN(id)) {
        return reply.status(400).send({ error: 'ID inválido' });
      }

      const parsedBody = alunoSchema.parse(request.body);

      await updateAluno(
        id,
        parsedBody.nome,
        parsedBody.cod_curso,
        parsedBody.email,
        parsedBody.data_nascimento,
        parsedBody.situacao_aluno
      );

      reply.status(200).send({ message: 'Aluno atualizado com sucesso' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ error: error.errors });
      } else {
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  });

};

