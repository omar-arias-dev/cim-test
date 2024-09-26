import {
  createBrowserRouter,
} from "react-router-dom";

import Login from "./../pages/Login";
import Tracker from "./../pages/Tracker";
import Map from "../pages/Map";
import NotFound from "../pages/NotFound/Index";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/tracker",
    element: <Tracker />,
  },
  {
    path: "/map/:limit/:page/:query",
    element: <Map />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);