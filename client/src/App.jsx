import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate
} from "react-router-dom";
import HomePage from './pages/HomePage/HomePage.jsx';
import SignUpPage from './pages/AuthenticationPages/SignUpPage/SignUpPage';
import SignInPage from './pages/AuthenticationPages/SignInPage/SignInPage';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
// import MessageBoard from './pages/tempPage.jsx';

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-16"></div>
      <Outlet />
      <Footer />
    </>
  )
};

const PrivateRoute = ({ children }) => {
  if (!localStorage.getItem('username')) {
    return <Navigate to="/sign-in" />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <PrivateRoute><HomePage /></PrivateRoute>,
      },
      // {
      //   path: "/messages",
      //   element: <MessageBoard />,
      // },
    ]
  },
  {
    path: "/sign-up",
    element: <SignUpPage />
  },
  {
    path: "/sign-in",
    element: <SignInPage />
  },
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;
