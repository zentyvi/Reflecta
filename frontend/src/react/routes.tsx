import { createBrowserRouter, Navigate } from "react-router";
import App from "./App.tsx";
import AuthPage from "./Pages/AuthPage.tsx";
import LoginForm from "./features/auth/LoginForm.tsx";
import RegisterForm from "./features/auth/RegisterForm.tsx";

const siteRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/auth",
        element: <AuthPage />,
        children: [
          { index: true, element: <Navigate to={"/auth/login"} replace /> },
          { path: "/auth/login", element: <LoginForm /> },
          { path: "/auth/register", element: <RegisterForm /> },
        ],
      },
    ],
  },
]);

export default siteRouter;
