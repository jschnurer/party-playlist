import React from "react";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Home from "./components/home/Home";
import Room from "./components/room/Room";
import settings from "./settings";

const router = createBrowserRouter([
  {
    path: "",
    element: <Home />,
  },
  {
    path: "/room/:code",
    element: <Room />,
  },
], {
  basename: settings.baseUrl,
});

const Routing: React.FC = () => <RouterProvider router={router} />;

export default Routing;