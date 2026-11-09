import { createBrowserRouter, Navigate } from "react-router";
import App from "./App.tsx";
import links from "./config/navigation_links.tsx";

import LoginForm from "./features/auth/LoginForm.tsx";
import RegisterForm from "./features/auth/RegisterForm.tsx";
import GuestRoute from "./features/route_wrappers/GuestRoute.tsx";

import AuthPage from "./pages/AuthPage.tsx";
import GithubCallbackPage from "./pages/GithubCallbackPage.tsx";
import ProtectedRoute from "./features/route_wrappers/ProtectedRoute.tsx";
import AppLayout from "./pages/AppLayout.tsx";

const siteRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            path: links.auth.path,
            element: <AuthPage />,
            children: [
              {
                index: true,
                element: <Navigate to={links.auth.login} replace />,
              },
              { path: links.auth.login, element: <LoginForm /> },
              { path: links.auth.register, element: <RegisterForm /> },
            ],
          },
          { path: links.auth.githubCallback, element: <GithubCallbackPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <AppLayout />,
            children: [],
          },
        ],
      },
    ],
  },
]);

export default siteRouter;
