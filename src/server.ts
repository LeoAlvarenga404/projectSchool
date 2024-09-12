import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { alunoRoutes } from './routes/alunoRoutes';
import { authRoutes } from './routes/authRoutes'
const app = fastify();
const port = 3000;

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(alunoRoutes);
app.register(authRoutes)

app.listen({ port }).then(() => {
  console.log('Servidor rodando na porta:', port);
});
