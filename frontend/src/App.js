import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import RootLayout from './pages/Root';
import { Helmet } from 'react-helmet-async';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <PostListPage />,
      },
      {
        path: ':username',
        children: [
          {
            index: true,
            element: <PostListPage />,
          },
          {
            path: ':postId',
            element: <PostPage />,
          },
        ],
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/write',
        element: <WritePage />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <Helmet>
        <title>Multi Boards</title>
      </Helmet>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
