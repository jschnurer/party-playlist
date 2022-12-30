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
import errorHandler from "validation/errorHandler";

export const app = express();
const port = settings.httpPort;

const httpServer = http.createServer(app);
const socketServer = new SocketClientManagement(httpServer);

app.use(compression());
app.use(cors());

// Handle hosting React app.
app.use(staticApp(resolve("./") + "/clientApp"));
app.use(json());

app.use("*", (_, res, next) => {
  res.locals.socketServer = socketServer;
  next();
});

// // Check token unless it's the login route.
// app.use("*", expressAsyncHandler(async (req, res, next) => {
//   const ix = exposedRoutes.indexOf(req.baseUrl.toLowerCase());
//   const isExposedRoute = ix !== -1
//     || (!req.baseUrl.toLowerCase().startsWith("/api")
//       && !req.baseUrl.toLowerCase().startsWith("/static"))

//   if (!isExposedRoute) {
//     const authHeader = req.header("authorization") || "";

//     // Require authentication key for all requests other than logging in.
//     if (!authHeader.trim()
//       || authHeader.indexOf("Bearer ") !== 0) {
//       throw new ApiError("Unauthorized.", ErrorTypes.Unauthorized);
//     }

//     const token = authHeader.substring("Bearer ".length);

//     const user = await getUserFromToken(token);

//     if (!user) {
//       throw new ApiError("Unauthorized.", ErrorTypes.Unauthorized);
//     }

//     // Provide the current user to all routes.
//     res.locals.user = user;

//     // Provide the socket server to all routers.
//     res.locals.socketServer = socketServer;
//   }

//   next();
// }));

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