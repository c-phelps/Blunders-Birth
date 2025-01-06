const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
require("dotenv").config();

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

// set default port
const PORT = process.env.PORT || 3001;
const app = express();
// define the new apollo server w/schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// create instance of apollo server w/ custom schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  // static image assets
  app.use("/images", express.static(path.join(__dirname, "../client/images")));

  app.use("/graphql", expressMiddleware(server));

  //   determine if we need to retrieve files from dist folder when environment = production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));
    app.use((req, res, next) => {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      next();
    });

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }
  //   make sure the db opens successfully then set the app to listen on the expected port and display success log in terminal
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
