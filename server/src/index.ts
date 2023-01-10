import compression from "compression";
import getRoomsController from "controllers/rooms-controller";
import getSongsController from "controllers/songs-controller";
import cors from "cors";
import express, { json, Request, Response, static as staticApp } from "express";
import fs from "fs";
import http from "http";
import IController from "models/controllers/IController";
import { resolve } from "path";
import settings from "settings";
import { SocketClientManagement } from "socketio/SocketClientManagement";
import ApiError from "validation/ApiError";
import errorHandler from "validation/errorHandler";
import ErrorTypes from "validation/ErrorTypes";

export const app = express();
const port = settings.httpPort;

const httpServer = http.createServer(app);
const socketServer = new SocketClientManagement(httpServer);

app.use(compression());
app.use(cors());

// Handle hosting React app.
app.use(staticApp(resolve("./") + "/clientApp"));
app.use(json());

app.use("*", (req, res, next) => {
  // Check to ensure the request contains the username header.
  const username = req.header("username") || "";

  if (!username?.trim()) {
    throw new ApiError("The required header `username` was not provided.",
      ErrorTypes.Unauthorized);
  }

  // Save the socketServer and username for later use by controllers.
  res.locals.socketServer = socketServer;
  res.locals.username = username;

  next();
});

// Set up all the routers.
useRouter(getRoomsController(socketServer));
useRouter(getSongsController());

// Set up socket server.
socketServer.start();

app.get("*", (req, res, next) => {
  console.log(req);
  console.log(res);
  next();
});

/** Handle file and 404 results. */
app.get("*", (req: Request, res: Response) => {
  // If file exists, return it.
  try {
    const getPath = resolve("./clientApp") + req.url.replace("..", "");
    if (fs.existsSync(getPath)) {
      res.sendFile(getPath);
      return;
    }
  } catch (err) {
    console.warn("Failed to handle file result:");
    console.warn(err);
  }

  // Otherwise, return index.html.
  res.sendFile(resolve("./") + "/clientApp/index.html");
});

app.use(errorHandler as any);

httpServer.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

function useRouter({ baseRoute, router }: IController) {
  app.use("/api" + baseRoute, router);
}