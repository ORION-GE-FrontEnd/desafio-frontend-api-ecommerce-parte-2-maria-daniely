import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import { typeDefs } from "./schema";
import resolvers from "./resolvers";

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer)
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `Servidor BFF GraphQL rodando em http://localhost:${PORT}/graphql`
    );
  });
}

startServer();
