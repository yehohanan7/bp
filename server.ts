import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server, Socket } from "socket.io";

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = "localhost";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();


declare global {
  var sockets: Socket[];
}

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  if (!global.sockets) {
    global.sockets = [];
  }
  io.on("connection", (socket) => {
    console.log(`A client connected: ${socket.id}`);
    global.sockets.push(socket);
    socket.on("disconnect", () => {
      console.log(`A client disconnected: ${socket.id}`);
    });
  });



  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});