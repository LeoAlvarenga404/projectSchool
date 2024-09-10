import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { alunoRoutes } from './routes/alunoRoutes';

const app = fastify();
const port = 3000;

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(alunoRoutes);

app.listen({ port }).then(() => {
  console.log('Servidor rodando na porta:', port);
});
