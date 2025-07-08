import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

async function startServer() {
  const app = express();
  
  // Disable trust proxy to avoid rate limiting issues in Replit
  app.set('trust proxy', false);
  
  // Security middleware with relaxed settings for development
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    hsts: false
  }));
  
  app.use(cors({
    origin: true,
    credentials: true
  }));
  
  app.use(compression());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      port: process.env.PORT || 4000
    });
  });

  // Simple logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: ({ req }) => {
      return { req };
    }
  });

  await server.start();
  server.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: false // We already configured CORS above
  });

  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API Gateway running on http://0.0.0.0:${PORT}${server.graphqlPath}`);
    console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
  });
}

startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
