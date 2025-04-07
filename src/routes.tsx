import { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';

import { Navigate } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About/About'));
const Table = lazy(() => import('./pages/Table'));
const Table2 = lazy(() => import('./pages/Table2/Table2'));
const Form = lazy(() => import('./pages/Form/index'));
const Echarts = lazy(() => import('./pages/Echarts/index'));
const ClassComponent = lazy(() => import('./pages/classComponent'));
const ImgList = lazy(() => import('./pages/ImgList/index'));
const PerInfo = lazy(() => import('./pages/PerInfo/perinfo'));

// 新增登录页导入
const Login = lazy(() => import('./pages/Login/index'));
// 新增私有路由组件
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token'); // 或使用你的token存储方式
  return token ? children : <Navigate to="/login" replace />;
};

const routes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <About />
      </Suspense>
    ),
  },
  {
    path: '/table',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <Table />
      </Suspense>
    ),
  },
  {
    path: '/table2',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <Table2 />
      </Suspense>
    ),
  },
  {
    path: 'form/form1',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <Form />
      </Suspense>
    ),
  },
  {
    path: '/echarts',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <Echarts />
      </Suspense>
    ),
  },
  {
    path: '/classComponent',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <ClassComponent />
      </Suspense>
    ),
  },

  {
    path: '/imgList',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <ImgList />
      </Suspense>
    ),
  },
  {
    path: '/perInfo',
    element: (
      <PrivateRoute>
        <Suspense fallback={<Spin size="large" />}>
          <PerInfo />
        </Suspense>
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<Spin size="large" />}>
        <h1>404</h1>
      </Suspense>
    ),
  },
];

export default routes;
