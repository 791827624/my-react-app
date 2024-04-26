import { RouterProvider, createBrowserRouter, Link } from "react-router-dom";
import "./App.css";
import React from "react";
import { Lili } from "./pages/lili";
import { ThemeProvider } from "./components/ThemeProvider";
import { Card } from "antd";
import { PersonalProfile } from "./pages/personal-profile";
import { MyComponents } from "./pages/my-components";

const MyWords = () => (
  <div>
    <Card type="inner" title="">
      <div> 这里是zzc的个人网站</div>
      <p>tel: 13621824095</p>
      <p>e-mail: 791827624@qq.com</p>
      <p>
        <Link to="/personal-profile">看下我的个人简历吧</Link>
      </p>
      <p>
        <Link to="/lili-hub">lili-hub</Link>
      </p>
    </Card>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider>
        <MyWords />
      </ThemeProvider>
    ),
    children: [
      {
        path: "home",
        element: <MyWords />,
      },
      {
        path: "my-components",
        element: <MyComponents />,
      },
      {
        path: "lili-hub",
        element: <Lili />,
      },
      {
        path: "personal-profile",
        element: <PersonalProfile />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
