import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManger.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "..", ".env") });
import userRoutes from "./routes/usersRoutes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'self' data: blob: 'unsafe-inline' 'unsafe-eval'; connect-src * ws: wss:;",
  );
  next();
});
app.set("port", process.env.PORT || 3002);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);
app.use(express.static(join(__dirname, "../../frontend/dist")));
app.get("/:room", (req, res) => {
  res.sendFile(join(__dirname, "../../frontend/dist/index.html"));
});
app.get((req, res) => {
  res.sendFile(join(__dirname, "../../frontend/dist/index.html"));
});
const start = async () => {
  const connectionDb = await mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDb connected");
  server.listen(app.get("port"), "0.0.0.0", () => {
    console.log("PORT LISTENING ON PORT " + app.get("port"));
  });
};

start();
