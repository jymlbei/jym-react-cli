import asyncComponent from '@util/asyncComponent';

// 基础路由
export const baseRoutes = [
  // {
  //   path: '/error',
  //   component: asyncComponent(() => import('@view/error'), '提示'),
  // },
];

// 业务路由
export const businessRoutes = [
  {
    path: '/home',
    component: asyncComponent(() => import('@view/home'), '主页'),
    KeepAlive: true, // 需要KeepAlive
    when: 'always',
  },
  {
    path: '/task',
    component: asyncComponent(() => import('@view/task'), ''),
    children: [
      {
        path: '/task/taskList',
        component: asyncComponent(() => import('@view/task/taskList'), ''),
      },
    ],
  },
];
