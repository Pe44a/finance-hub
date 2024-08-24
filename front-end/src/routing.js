import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <LandingPage /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "dashboard", element: <Dashboard /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
