import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from "react-router-dom";
import Home from "./components/home/Home";
import RoomChecker from "./components/room/RoomChecker";
import settings from "./settings";

const router = createBrowserRouter([
  {
    path: "",
    element: <Home />,
  },
  {
    path: "/room/:code",
    element: <RoomChecker />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
], {
  basename: settings.baseUrl,
});

const Routing: React.FC = () => <RouterProvider router={router} />;

export default Routing;