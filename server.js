
require("dotenv").config();
const mongoose = require("mongoose");


const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const NotFoundError = require("./errors/not-found");
const usersController = require("./api/users/users.controller");
const userRouter = require("./api/users/users.router");
const articlesRouter = require("./api/articles/articles.router");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connecte :", process.env.MONGODB_URI))
  .catch((err) => {
    console.error("Erreur Mongodb :", err);
    process.exit(1);
  });


io.on("connection", () => console.log("socket connecte"));
app.use((req, _res, next) => { req.io = io; next(); });


app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use("/api/users", userRouter);
app.use("/api/articles", articlesRouter);


app.post("/login", usersController.login);


app.use("/", express.static("public"));


app.use((req, res, next) => next(new NotFoundError()));

app.use((error, req, res, _next) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  res.status(status).json({ status, message });
});


const PORT = process.env.PORT || 3000;
let isStarting = false;

const startServer = (port = PORT, callback) => {
  // Si le serveur écoute déjà, on ne fait rien
  if (server.listening) {
    if (typeof callback === "function") {
      callback();
    }
    return server;
  }

  if (isStarting) {
    if (typeof callback === "function") {
      callback();
    }
    return server;
  }

  isStarting = true;

  try {
    return server.listen(port, () => {
      isStarting = false;
      console.log(`Serveur actif sur http://localhost:${port}`);
      if (typeof callback === "function") {
        callback();
      }
    }).on('error', (err) => {
      isStarting = false;
      if (err.code === 'EADDRINUSE') {
        console.error(`Le port ${port} est deja utilise. Arretez l'autre processus ou changez le port.`);
      } else if (err.code === 'ERR_SERVER_ALREADY_LISTEN') {
        console.error(`Le serveur est deja en ecoute.`);
      } else {
        console.error(`Erreur lors du demarrage du serveur:`, err.message);
      }
      if (typeof callback === "function") {
        callback(err);
      }
    });
  } catch (err) {
    isStarting = false;
    if (err.code === 'ERR_SERVER_ALREADY_LISTEN') {
      console.error(`Le serveur est deja en ecoute.`);
      if (typeof callback === "function") {
        callback(err);
      }
      return server;
    }
    throw err;
  }
};

if (process.env.NODE_ENV !== "test" && require.main === module) {
  startServer();
}

module.exports = { app, server, startServer };
