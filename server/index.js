import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";

import { PORT } from "./config.js";

//tengo que crear un nuevo servidor para socket io
const app = express();
const server = http.createServer(app);
//configuracion del socket
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());
app.use(morgan("dev"));
//necesito que me escuche el servidor
io.on("connection", (socket) => {
  console.log(socket.id);

  //cuando el socket te envie (emit) un evento
  //el que escucha o el que quiero que escuche siempre va a tener la funcion ON
  socket.on("message", (message) => {
    //ahora necesito que se guarde en la base de datos
    //ahora tengo que reenviarlo
    console.log(message);
    socket.broadcast.emit("message", {
      body: message,
      from: socket.id,
    });
  });
});

server.listen(PORT);
console.log("Server started on port", PORT);
