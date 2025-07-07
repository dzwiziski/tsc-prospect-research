import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

async function startServer() {
  const app = express();
  
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));
  
  app.use(cors({
    origin: true,
    credentials: true
  }));
  
  app.use(compression());
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });
  app.use(limiter);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
