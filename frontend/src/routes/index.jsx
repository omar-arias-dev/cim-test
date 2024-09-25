import {
  createBrowserRouter,
} from "react-router-dom";

import Login from "./../pages/Login";
import Tracker from "./../pages/Tracker";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/tracker",
    element: <Tracker />,
  },
]);