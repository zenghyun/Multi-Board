# Frontend

## 기본 설정 파일 만들기 

### 📌  .prettierrc

```js
{
    "singleQuote": true,
    "semi": true,
    "useTabs": false,
    "tabWidth": 2,
    "trailingComma": "all",
    "printWidth": 80
}
```
<br>

### 📌  jsconfig.json

```js
{
    "compilerOptions": {
        "target": "ES6"
    }
}
```

<br>

----

<br>

## App 컴포넌트 경로 지정 

<br>

### 📌 리팩토링 전 

<br />

```js
import { Route, Routes } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';

onst App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<PostListPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/write" element={<WritePage />} />
      <Route path="/@:username">
        <Route index element={<PostListPage />} />
        <Route path=":postId" element={<PostPage />} />
      </Route>
    </Routes>
    </>
  );
};
export default App;
```
<br>

### 📌 리팩토링 후 

<br />

```js
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import RootLayout from './pages/Root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true, 
        element: <PostListPage />
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
            element: <PostPage />
          }
        ]
      },
      {
        path: '/login', 
        element: <LoginPage />
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '/write',
        element: <WritePage />
      },
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

```
