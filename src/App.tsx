/* eslint-disable react-hooks/rules-of-hooks */
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import React, { useEffect } from "react";
import { Lili } from "./pages/lili";
import { ThemeProvider } from "./components/ThemeProvider";
import { Outlet } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider>
        <div>Hello, 这里是zzc的个人网站</div>
      </ThemeProvider>
    ),
    children: [
      {
        path: "home",
        element: <div>Hello, 这里是zzc的个人网站</div>,
      },
      {
        path: "lili",
        element: <Lili />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
