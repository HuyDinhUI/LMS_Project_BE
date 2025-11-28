import express from "express";
import http from "http";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { APIs_v1 } from "./src/Routes/v1/index.js";
import cors from "cors"
import { corsOptions } from "./src/config/corsOptions.js";
import path from "path"
import { initSocket } from "./src/sockets/index.js";


const app = express()

const START_SERVER = () => {
  app.use(express.json());

  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  app.use(cookieParser());

  app.use(cors(corsOptions));

  const __dirname = path.resolve();
  
  app.use("/contents", express.static(path.join(__dirname, "contents")));

  app.use("/v1", APIs_v1);

  const PORT = process.env.PORT;

  const server = http.createServer(app)

  const io = initSocket(server)

  app.set("io",io)

  // Start server
  server.listen(PORT, () => {
    console.log(`🚀 Node LTI chạy tại http://localhost:${PORT}`);
  });
};

START_SERVER()
